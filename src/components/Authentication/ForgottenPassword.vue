<template>
	<AuthenticationSkeleton>
		<template #title>
			Mot de passe oublié ?
		</template>
		<template #default>
			<AuthenticationMessage v-if="message.text.length" :messageType="message.type">
				<span v-html="message.text"></span>
			</AuthenticationMessage>
			<AuthenticationForm v-if="storedState !== AuthenticationState.Success" :elements="elements" @submit="$emit('submitForm', $event)"/>
			<a href="javascript:void(0);" @click.prevent="storedStep = AuthenticationStep.LogingIn">
				{{ linkText }}
			</a>
		</template>
	</AuthenticationSkeleton>
</template>

<script setup lang="ts">
	import { markRaw } from "vue";
	import { mapState, mapWritableState } from 'pinia';
	import { useAuthenticationStore } from '@/stores/authentication';
	import { AuthenticationState, AuthenticationStep, FormElementType, MessageType, type IFormElement, type TMessage } from '@/models/Authentication';
	import AuthenticationSkeleton from '@/components/Authentication/AuthenticationSkeleton.vue';
	import AuthenticationMessage from '@/components/Authentication/AuthenticationMessage.vue';
	import AuthenticationForm from '@/components/Authentication/AuthenticationForm.vue';
	import IconMail from '@/components/icons/IconMail.vue';
</script>

<script lang="ts">
	export default {
		emits: ['submitForm'],
		data() {
			return {
				elements: [
					{
						id: 'gcs_mail',
						type: FormElementType.Text,
						value: '',
						label: 'Adresse mail',
						autocomplete: 'email',
						autofocus: true,
						icon: markRaw(IconMail),
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
				const sendMailSuccess = {
					text: 'Un email vient de vous être envoyé.',
					type: MessageType.Success,
				};
				const sendMailError = {
					text: '',
					type: MessageType.Success,
				};
				const sendMailProgress = {
					text: 'Envoi de l\'email en cours...',
					type: MessageType.Notice,
				};
				let message = defaultMessage;

				switch (this.storedState) {
					case AuthenticationState.Error :
						message = sendMailError;
						break;
					case AuthenticationState.Success :
						message = sendMailSuccess;
						break;
					case AuthenticationState.Progress :
						message = sendMailProgress;
						break;
				}
				return message;
			},
		},
	};
</script>
