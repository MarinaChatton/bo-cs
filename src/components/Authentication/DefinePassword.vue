<template>
	<AuthenticationSkeleton>
		<template #title>
			Mot de passe oublié ?
		</template>
		<template #default>
			<AuthenticationMessage v-if="message.text.length" :messageType="message.type">
				<span v-html="message.text"></span>
			</AuthenticationMessage>
			<AuthenticationForm v-if="storedState !== AuthenticationState.Success" :elements="elements"  @submit="$emit('submitForm', $event)"/>
			<a href="javascript:void(0);" @click.prevent="storedStep = AuthenticationStep.LogingIn">
				{{ linkText }}
			</a>
			</template>
		</AuthenticationSkeleton>
</template>

<script setup lang="ts">
	import { mapState, mapWritableState } from 'pinia';
	import { useAuthenticationStore } from '@/stores/authentication';
	import { AuthenticationState, AuthenticationStep, FormElementType, MessageType, type IFormElement, type TMessage } from '@/models/Authentication';
	import AuthenticationSkeleton from '@/components/Authentication/AuthenticationSkeleton.vue';
	import AuthenticationMessage from '@/components/Authentication/AuthenticationMessage.vue';
	import AuthenticationForm from '@/components/Authentication/AuthenticationForm.vue';
</script>

<script lang="ts">
	export default {
		emits: ['submitForm'],
		data() {
			return {
				elements: [
					{
						id: 'gcs_password_recovery',
						type: FormElementType.Password,
						value: '',
						label: 'Nouveau mot de passe',
						autocomplete: 'new-password',
						autofocus: true,
					},
					{
						id: 'gcs_password_recovery_confirm',
						type: FormElementType.Password,
						value: '',
						label: 'Confirmation du mot de passe',
						autocomplete: 'new-password',
					},
					{
						id: 'gcs_submit',
						type: FormElementType.Submit,
						value: 'OK',
					},
				] as IFormElement[],
			};
		},
		computed: {
      ...mapState(useAuthenticationStore, {
				storedState: 'state',
			}),
      ...mapWritableState(useAuthenticationStore, {
				storedStep: 'step',
			}),
			linkText() {
				return [AuthenticationState.Success, AuthenticationState.Progress].indexOf(this.storedState) !== -1 ? "Retour" : "Annuler";
			},
			message(): {text: string, type: TMessage} {
				const defaultMessage = {
					text: '',
					type: MessageType.Info,
				};
				const newPwdSuccess = {
					text: 'Votre mot de passe à été modifié avec succès.',
					type: MessageType.Success,
				};
				const newPwdError = {
					text: 'Merci de saisir le mot de passe et sa confirmation.',
					type: MessageType.Error,
				};
				let message = defaultMessage;

				switch (this.storedState) {
					case AuthenticationState.Error :
						message = newPwdError;
						break;
					case AuthenticationState.Success :
						message = newPwdSuccess;
						break;
				}
				return message;
			},
		},
	};
</script>
