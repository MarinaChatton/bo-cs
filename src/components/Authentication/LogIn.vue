<template>
	<AuthenticationSkeleton>
		<template #title>
			<strong>Connexion</strong> à l'administration
		</template>
		<template #default>
			<AuthenticationForm :elements="elements" @submit="$emit('submitForm', $event)"/>
			<a href="javascript:void(0);" @click.prevent="storedStep = AuthenticationStep.SendingMail">
				Mot de passe oublié ?
			</a>
		</template>
	</AuthenticationSkeleton>
</template>

<script setup lang="ts">
	import { mapWritableState } from 'pinia';
	import { useAuthenticationStore } from '@/stores/authentication';
	import { markRaw} from "vue";
	import { AuthenticationStep, FormElementType, type IFormElement } from '@/models/Authentication';
	import AuthenticationSkeleton from '@/components/Authentication/AuthenticationSkeleton.vue';
	import AuthenticationForm from '@/components/Authentication/AuthenticationForm.vue';
	import IconUser from '@/components/icons/IconUser.vue';
</script>

<script lang="ts">
	export default {
		emits: ['submitForm'],
		data() {
			return {
				elements: [
					{
						id: 'gcs_login',
						type: FormElementType.Text,
						value: '',
						label: 'Identifiant',
						autocomplete: 'username',
						autofocus: true,
						icon: markRaw(IconUser),
					},
					{
						id: 'gcs_password',
						type: FormElementType.Password,
						value: '',
						label: 'Mot de passe',
						autocomplete: 'current-password',
					},
					{
						id: 'gcs_remember_me',
						type: FormElementType.Checkbox,
						value: false,
						label: 'Se souvenir de moi',
					},
					{
						id: 'gcs_submit',
						type: FormElementType.Submit,
						value: 'Se connecter',
					},
				] as IFormElement[],
			};
		},
		computed: {
      ...mapWritableState(useAuthenticationStore, {
				storedStep: 'step',
			}),
		},
	};
</script>
