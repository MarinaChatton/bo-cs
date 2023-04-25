<template>
	<AuthenticationSkeleton>
		<template #title>
			<strong>Connexion</strong> à l'administration
		</template>
		<template #default>
			<div class="csAuth__checkingSession">Vérification de la session en cours...</div>
    </template>
	</AuthenticationSkeleton>
</template>

<script setup lang="ts">
	import AuthenticationSkeleton from '@/components/Authentication/AuthenticationSkeleton.vue';
</script>

<style scoped>
	.csAuth__checkingSession {
		margin: 25px 0 15px;
		text-align: start;
		font-weight: bold;
		font-size: 14px;
	}
</style>
