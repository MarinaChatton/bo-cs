<template>
  <Teleport to="body">
    <div class="csAuthModal">
      <div class="csAuthModal__popup">
        <CheckSession v-if="storedStep === AuthenticationStep.CheckingSession" />
        <ForgottenPassword v-else-if="storedStep === AuthenticationStep.SendingMail" @submitForm="onMailSubmit($event)"/>
        <DefinePassword v-else-if="storedStep === AuthenticationStep.DefiningPassword" @submitForm="onNewPasswordSubmit($event)"/>
        <LogIn v-else @submitForm="onLoginSubmit($event)"/>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { mapActions, mapState, mapWritableState } from 'pinia';
  import { useAuthenticationStore } from '@/stores/authentication';
  import { AuthenticationStep } from '@/models/Authentication';
  import { hasTemporaryPassword } from '@/http/Authentication';
  import CheckSession from '@/components/Authentication/CheckSession.vue';
  import LogIn from '@/components/Authentication/LogIn.vue';
  import ForgottenPassword from '@/components/Authentication/ForgottenPassword.vue';
  import DefinePassword from '@/components/Authentication/DefinePassword.vue';
</script>

<script lang="ts">
  export default {
    emits: ['authenticationCheck'],
    computed: {
      ...mapState(useAuthenticationStore, {
        storedUserIsAuthenticated: 'userIsAuthenticated',
      }),
      ...mapWritableState(useAuthenticationStore, {
        storedStep: 'step',
      }),
    },
    methods: {
      ...mapActions(useAuthenticationStore, {
        onLoginSubmit: 'submitLogin',
        onMailSubmit: 'submitSendMail',
        onNewPasswordSubmit: 'submitSetPassword',
        onCheckSession: 'checkSession',
      }),
    },
    watch: {
      storedUserIsAuthenticated(val) {
        this.$emit('authenticationCheck', val);
      },
    },
    mounted() {
      if (hasTemporaryPassword()) {
        this.storedStep = AuthenticationStep.DefiningPassword;
      } else {
        this.onCheckSession();
      }
    }
  };
</script>

<style scoped>
  .csAuthModal {
    position: fixed;
    font-family: var(--csBo-auth-font);
    line-height: normal;
    font-size: 14px;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .2);
  }

  .csAuthModal__popup {
    background-color: var(--csBo-authModal_background);
    color: var(--csBo-authModal_color);
    width: 450px;
    max-width: 100%;
    max-height: 100%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25), 4px 4px 15px -2px rgba(0, 0, 0, 0.8);
    padding: 15px 25px;
    text-align: center;
    overflow: auto;
    box-sizing: border-box;
  }

  @media (min-width: 850px) {
    .csAuthModal__popup {
      padding: 15px 50px;
    }
  }

  /* global  */
  .csAuthModal :deep(a) {
    cursor: pointer;
    color: var(--csBo-auth-link_color);
    text-decoration: underline;
    outline: none;
    transition: color .3s ease;
  }

  .csAuthModal :deep(a:hover),
  .csAuthModal :deep(a:focus-visible) {
    color: var(--csBo-auth-link_color-hover);
  }

  .csAuthModal :deep(button),
  .csAuthModal :deep(.button),
  .csAuthModal :deep(input[type="button"]),
  .csAuthModal :deep(input[type="submit"]) {
    color: var(--csBo-auth-button_color);
    background-color: var(--csBo-auth-button_background);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-family: inherit;
    line-height: normal;
    font-size: inherit;
    font-weight: bold;
    padding: 9px 10px;
    text-align: center;
    border: none;
    outline: none;
    box-shadow: none;
    border-radius: 4px;
    transition: color .3s ease, background-color .3s ease;
  }

  .csAuthModal :deep(button:hover),
  .csAuthModal :deep(.button:hover),
  .csAuthModal :deep(button:focus-visible),
  .csAuthModal :deep(.button:focus-visible),
  .csAuthModal :deep(input[type="button"]:hover),
  .csAuthModal :deep(input[type="submit"]:hover),
  .csAuthModal :deep(input[type="button"]:focus-visible),
  .csAuthModal :deep(input[type="submit"]:focus-visible) {
    color: var(--csBo-auth-button_color-hover);
    background-color: var(--csBo-auth-button_background-hover);
  }

  .csAuthModal :deep(button:disabled),
  .csAuthModal :deep(.button:disabled),
  .csAuthModal :deep(input[type="button"]:disabled),
  .csAuthModal :deep(input[type="submit"]:disabled) {
    cursor: not-allowed;
    color: var(--csBo-auth-button_color-disabled);
    background-color: var(--csBo-auth-button_background-disabled);
  }
</style>

<style>
  :root {
    --csBo_color1: #fff;
    --csBo_color2: #1C222E;
    --csBo_color3: #50afc6;
    --csBo_color4: #cfcfcf;
    --csBo_color5: #46b6d2;

    --csBo-auth-font: 'Nunito Sans', 'Calibri', Verdana, sans-serif;

    --csBo-auth-button_background: var(--csBo_color3);
    --csBo-auth-button_background-hover: var(--csBo_color5);
    --csBo-auth-button_color: var(--csBo_color1);
    --csBo-auth-button_color-hover: var(--csBo_color1);
    --csBo-auth-button_color-disabled: var(--csBo_color1);
    --csBo-auth-button_background-disabled: var(--csBo_color4);

    --csBo-auth-link_color: var(--csBo_color2);
    --csBo-auth-link_color-hover: var(--csBo_color3);

    
    --csBo-authModal_background: var(--csBo_color1);
    --csBo-authModal_color: var(--csBo_color2);
  }
</style>
