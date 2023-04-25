<template>
  <template v-if="storedUserIsAuthenticated">
    <button @click="logOut">Log out</button>
    <p>I am authenticated, yay!</p>
  </template>
  <Authentication v-else/>
  <h1>Paramètres de test</h1>
  <section>
    <h2>Ecran de connexion</h2>
    <ul>
      <li>Identifiant: <strong>test</strong></li>
      <li>Mot de passe: <strong>123</strong></li>
    </ul>
    <p>En cas de succès, on bascule sur un autre affichage avec un bouton permettant d'émuler une déconnexion</p>
  </section>
  <section>
    <h2>Ecran de récupération de mot de passe</h2>
    <ul>
      <li>Mail: <strong>test@test.com</strong></li>
    </ul>
    <p>En cas de succès, une alerte permet de basculer directement sur l'écran de régénération de mot de passe</p>
  </section>
  <section>
    <h2>Ecran de régénération mot de passe</h2>
    <p>Ecran accessible en ajoutant <strong>?wg_genere_password=test==</strong> à la fin de l'url.<br/>Ex: http://localhost:5173/index?wg_genere_password=test==</p>
    <ul>
      <li>Mot de passe : chaîne non-vide</li>
      <li>Confirmation mot de passe: identique au mot de passe</li>
    </ul>
    <p>N.B: le mot de passe accepté sur l'écran de connexion ne sera pas changé</p>
    <p>En cas de succès, on est automatiquement renvoyé sur la page de connexion au bout de quelques secondes</p>
  </section>
</template>

<script setup lang="ts">
  import { mapActions, mapState } from 'pinia';
  import Authentication from '@/components/Authentication.vue';
import { useAuthenticationStore } from '@/stores/authentication';
</script>

<script lang="ts">
  // this component is for testing purpose only!
  export default {  
    computed: {
      ...mapState(useAuthenticationStore, {
        storedUserIsAuthenticated: 'userIsAuthenticated',
      }),
    },
    methods: {
      ...mapActions(useAuthenticationStore, ['logOut']),
    },
  };
</script>

<style scoped>
  section {
    box-sizing: border-box;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 0 1rem;
    margin-bottom: 1rem;
    max-width: 100%;
  }

  @media (min-width: 1200px) {
    section {
      width: calc((100% - 450px + 1rem) / 2);
    }
  }
</style>