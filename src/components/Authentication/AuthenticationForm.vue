<template>
	<form class="csAuthForm" ref="form" @submit.prevent="submit">
		<div v-for="element in elements" :key="element.id" class="csAuthForm__element"
			:class="'csAuthForm__element--' + element.type">

      <template v-if="isSimpleInputType(element.type)">
        <label :for="element.id">{{ element.label }}</label>
				<div class="csAuthForm__inputWrapper">
					<input :id="element.id" :ref="element.id"
            :type="element.type === FormElementType.Password ? displayPasswords[element.id] ? 'text' : 'password' : element.type"
            :name="element.id" v-model="element.value"
            :class="{'has-error' : storedState === AuthenticationState.Error}"
						:autocomplete="element.autocomplete">
					<span class="csAuthForm__inputIcon">
            <IconLock v-if="element.type === FormElementType.Password"/>
						<component v-else :is="element.icon"></component>
					</span>
					<span v-if="element.type === FormElementType.Password" class="csAuthForm__pwdToggle"
            :title="displayPasswords[element.id] ? 'Cacher le mot de passe' : 'Afficher le mot de passe'"
						@click="togglePwd(element.id)">
						<IconEyeClosed v-if="displayPasswords[element.id]" />
						<IconEyeOpen v-else />
					</span>
				</div>
      </template>

			<template v-else-if="element.type === FormElementType.Checkbox">
				<label class="csAuthForm__checkboxLabel">
					<span class="csAuthForm__checkboxLabelText">{{ element.label }}</span>
					<div class="csAuthForm__checkboxWrapper">
						<input type="checkbox" :name="element.id" :value="true" v-model="element.value">
						<div class="csAuthForm__pseudoCheckbox">
							<IconCheck />
						</div>
					</div>
				</label>
			</template>

			<template v-else-if="element.type === FormElementType.Submit">
				<button class="csAuthForm__button" type="submit" :disabled="storedState === AuthenticationState.Progress">
					{{ element.value }}
					<span v-if="storedState === AuthenticationState.Progress" class="csAuthForm__buttonSpinner">
						<svg viewBox="25 25 50 50">
							<circle cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-linecap="round"
									stroke-miterlimit="10" style="stroke: currentColor" />
						</svg>
					</span>
					<span v-else class="csAuthForm__buttonIcon">
						<IconArrowRightCircle />
					</span>
				</button>
			</template>

		</div>
	</form>
</template>

<script setup lang="ts">
  import { mapState } from 'pinia';
  import { useAuthenticationStore } from '@/stores/authentication';
	import type { PropType } from "vue";
	import IconEyeOpen from '@/components/icons/IconEyeOpen.vue';
	import IconEyeClosed from '@/components/icons/IconEyeClosed.vue';
	import IconCheck from '@/components/icons/IconCheck.vue';
	import IconLock from '@/components/icons/IconLock.vue';
	import IconArrowRightCircle from '@/components/icons/IconArrowRightCircle.vue';
  import { AuthenticationState, FormElementType, type IFormElement } from "@/models/Authentication";
</script>

<script lang="ts">
	export default {
    emits: ['submit'],
		props: {
			elements: {
				type: Object as PropType<IFormElement[]>,
				default: [],
			},
		},
		data() {
			return {
				displayPasswords: {} as { [key: string]: boolean },
			};
		},
    computed: {
      ...mapState(useAuthenticationStore, {
        storedState: 'state',
      }),
    },
		methods: {
      isSimpleInputType(type: FormElementType): boolean {
        return [FormElementType.Text, FormElementType.Password].indexOf(type) !== -1;
      },
			togglePwd(field: string): void {
				this.displayPasswords[field] = !this.displayPasswords[field];
			},
			submit(): void {
				const formEl = this.$refs.form as HTMLFormElement;
				if (formEl) {
					const formData = new FormData(formEl);
          this.$emit('submit', formData);
				}
			},
		},
    mounted() {
      // as 'autofocus' attributes works only on page load, we need to set focus manually when switching between components inside the same vue...
      const elementToFocus = this.elements.find((el) => {
        return el.autofocus;
      });

      if (elementToFocus) {
        const elRef = this.$refs[elementToFocus.id];
        if (Array.isArray(elRef) && elRef.length) {
          this.$nextTick(() => {
            elRef[0].focus(); // even if a single ref attribute matches, if the element is inside a v-for loop, the $refs value for this key will be an array
          });
        }
      }
    },
	};
</script>

<style scoped>
  .csAuthForm {
    margin: 20px 0 15px;
    text-align: start;
  }

  label {
    font-weight: bold;
  }

  button[type="submit"] {
    width: 100%;
  }

  button[type="submit"]:hover .csAuthForm__buttonIcon,
  button[type="submit"]:focus-visible .csAuthForm__buttonIcon {
    transform: translateX(2px);
  }

  .csAuthForm__buttonIcon,
  .csAuthForm__buttonSpinner {
    margin-left: 5px;
    height: 18px;
    width: 18px;
  }

  .csAuthForm__buttonIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform .3s ease;
  }

  .csAuthForm__buttonIcon svg {
    height: 100%;
    width: 100%;
  }

  .csAuthForm__buttonSpinner {
    position: relative;
    box-shadow: 0 0 2.5px 0 rgba(0, 0, 0, .3);
    background: currentColor;
    border-radius: 100%;
    opacity: 1;
  }

  .csAuthForm__buttonSpinner svg {
    color: var(--csBo-authForm_buttonLoader-color);
    position: absolute;
    top: 1px;
    left: 1px;
    height: calc(100% - 2px);
    width: calc(100% - 2px);
    animation: csloader-spinner-rotate 1.28973s linear infinite;
    transform-origin: center center;
  }

  .csAuthForm__buttonSpinner svg circle {
    animation: csloader-spinner-dash 2s ease-in-out infinite;
  }

  label + .csAuthForm__inputWrapper {
    margin-top: 6px;
  }

  .csAuthForm__element {
    margin-bottom: 12px;
  }

  .csAuthForm__element--submit {
    margin-top: 15px;
  }

  .csAuthForm__inputWrapper {
    position: relative;
  }

  .csAuthForm__inputWrapper input {
    background-color: var(--csBo-authForm_input-background);
    color: var(--csBo-authForm_input-color);
    border: 1px solid var(--csBo-authForm_input-border);
    padding: 10px 10px 10px 38px;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
    transition: border-color .3s ease, box-shadow .3s ease;
  }

  .csAuthForm__element--password .csAuthForm__inputWrapper input {
    padding-right: 38px;
  }

  .csAuthForm__inputWrapper input:focus-visible {
    border-color: var(--csBo-authForm_input-border-Focus);
    outline: none;
    box-shadow: none;
  }

  .csAuthForm__inputWrapper input.has-error {
    border-color: #D30027;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .05) inset, 0 0 8px rgba(211, 0, 39, .6);
  }

  .csAuthForm__inputWrapper input:focus-visible + .csAuthForm__inputIcon {
    color: var(--csBo-authForm_input-border-Focus);
  }

  .csAuthForm__inputIcon,
  .csAuthForm__pwdToggle {
    position: absolute;
    top: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-50%);
    transition: color .3s ease;
  }

  .csAuthForm__inputIcon {
    color: var(--csBo-authForm_input-border);
    pointer-events: none;
    left: 10px;
  }

  .csAuthForm__inputIcon svg {
    height: 18px;
    width: 18px;
  }

  .csAuthForm__pwdToggle {
    color: var(--csBo-authForm_pwdToggle);
    pointer-events: all;
		user-select: none;
    cursor: pointer;
    height: 100%;
    width: 38px;
    right: 0;
  }

  .csAuthForm__pwdToggle:hover {
    color: var(--csBo-authForm_pwdToggle-Hover);
  }

  .csAuthForm__pwdToggle svg {
    height: 20px;
    width: 20px;
  }

  .csAuthForm__checkboxLabel {
    display: inline-flex;
  }

  .csAuthForm__checkboxLabelText {
    order: 2;
    margin-left: 7px;
    ;
  }

  .csAuthForm__checkboxWrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    flex-shrink: 0;
  }

  .csAuthForm__checkboxWrapper input[type="checkbox"] {
    position: absolute;
    left: 0;
    transform: translateX(-100%);
    opacity: .01;
  }

  .csAuthForm__pseudoCheckbox {
    background-color: var(--csBo-authForm_checkbox-background);
    border: 1px solid var(--csBo-authForm_checkbox-border);
    color: transparent;
    cursor: pointer;
    position: relative;
    height: 16px;
    width: 16px;
    border-radius: 4px;
    transition: background-color .3s ease, border-color .3s ease, color .3s ease;
  }

  .csAuthForm__pseudoCheckbox svg {
    height: 100%;
    width: 100%;
  }

  input[type="checkbox"]:focus + .csAuthForm__pseudoCheckbox,
  .csAuthForm__checkboxLabel:hover .csAuthForm__pseudoCheckbox {
    border-color: var(--csBo-authForm_checkbox-border-Focus);
    background-color: var(--csBo-authForm_checkbox-background-Focus);
    color: var(--csBo-authForm_checkbox-color-Focus);
  }

  input[type="checkbox"]:checked + .csAuthForm__pseudoCheckbox {
    border-color: var(--csBo-authForm_checkbox-border-Checked);
    background-color: var(--csBo-authForm_checkbox-background-Checked);
    color: var(--csBo-authForm_checkbox-color-Checked);
  }

  input[type="checkbox"]:checked:focus-visible + .csAuthForm__pseudoCheckbox,
  .csAuthForm__checkboxLabel:hover input[type="checkbox"]:checked + .csAuthForm__pseudoCheckbox {
    border-color: var(--csBo-authForm_checkbox-border-Checked-Focus);
    background-color: var(--csBo-authForm_checkbox-background-Checked-Focus);
    color: var(--csBo-authForm_checkbox-color-Checked-Focus);
  }

	@media (min-width: 850px) {
    label + .csAuthForm__inputWrapper {
      margin-top: 10px;
    }

    .csAuthForm__element {
      margin-bottom: 22px;
    }

    .csAuthForm__element--submit {
      margin-top: 25px;
    }
  }

	@keyframes csloader-spinner-rotate {
			100% {
				transform: rotate(360deg);
			}
		}

  @keyframes csloader-spinner-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }

    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }
</style>

<style>
  :root {
    --csBo-authForm_input-background: var(--csBo_color1);
    --csBo-authForm_input-color: var(--csBo_color2);
    --csBo-authForm_input-border: var(--csBo_color4);
    --csBo-authForm_input-border-Focus: var(--csBo_color3);
    --csBo-authForm_pwdToggle: var(--csBo_color4);
    --csBo-authForm_pwdToggle-Hover: var(--csBo_color3);
    --csBo-authForm_checkbox-border: var(--csBo_color4);
    --csBo-authForm_checkbox-border-Focus: var(--csBo_color4);
    --csBo-authForm_checkbox-border-Checked: var(--csBo_color3);
    --csBo-authForm_checkbox-border-Checked-Focus: var(--csBo_color3);
    --csBo-authForm_checkbox-color-Focus: var(--csBo_color1);
    --csBo-authForm_checkbox-color-Checked: var(--csBo_color1);
    --csBo-authForm_checkbox-color-Checked-Focus: var(--csBo_color1);
    --csBo-authForm_checkbox-background: var(--csBo_color1);
    --csBo-authForm_checkbox-background-Focus: var(--csBo_color4);
    --csBo-authForm_checkbox-background-Checked: var(--csBo_color3);
    --csBo-authForm_checkbox-background-Checked-Focus: var(--csBo_color5);
    --csBo-authForm_buttonLoader-color: var(--csBo_color3);
  }
</style>
