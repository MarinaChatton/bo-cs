import { defineStore } from 'pinia'
import { readonly, ref, watch } from 'vue';
import { AuthenticationState, AuthenticationStep } from '@/models/Authentication'
import { ajaxCheckSession, ajaxLogin, ajaxLogout, ajaxSendMail, ajaxSetPassword } from '@/http/Authentication';

export const useAuthenticationStore = defineStore('authentication', () => {
  const _secureToken = ref('');

  const _userIsAuthenticated = ref(false); // do not expose outside the store, use userIsAuthenticated readonly value instead
  const userIsAuthenticated = readonly( _userIsAuthenticated);

  const _state = ref(AuthenticationState.Default); // same as above, with state readonly value
  const state = readonly(_state);

  const step = ref(AuthenticationStep.CheckingSession);

  watch(step, function() {
    _state.value = AuthenticationState.Default;
    checkSession();
  });

  function logOut() {
    _state.value = AuthenticationState.Progress;
    ajaxLogout(_secureToken.value)
      .then(data => {
        _userIsAuthenticated.value  = Boolean(data?.system?.isAuthenticated);
        _secureToken.value = (data?.system as any)?.secureToken || '';
        _state.value = AuthenticationState.Success;
      }).catch(err => {
        console.error(err);
        _state.value = AuthenticationState.Error;
      });
  }

  function checkSession() {
    if (step.value === AuthenticationStep.CheckingSession) {
      _state.value = AuthenticationState.Progress;
      ajaxCheckSession(_secureToken.value)
      .then(data => {
        _userIsAuthenticated.value = Boolean(data?.system?.isAuthenticated);
        _secureToken.value = (data?.system as any)?.secureToken || '';
        _state.value = AuthenticationState.Success;
        if (!userIsAuthenticated.value) {
          step.value = AuthenticationStep.LogingIn;
        };
      })
      .catch(err => {
        console.error(err);
        _state.value = AuthenticationState.Error;
      });
    }
  }

  function submitLogin(formData: FormData) {
    if (step.value === AuthenticationStep.LogingIn) {
      _state.value = AuthenticationState.Progress;
      ajaxLogin(formData, _secureToken.value)
        .then(data => {
          _userIsAuthenticated.value = Boolean(data?.system?.isAuthenticated);
          _secureToken.value = (data?.system as any)?.secureToken || '';
          _state.value =  userIsAuthenticated.value ? AuthenticationState.Success : AuthenticationState.Error;
        })
        .catch(err => {
          console.error(err);
          _state.value = AuthenticationState.Error;
        });
    }
  }

  function submitSendMail(formData: FormData) {
    if (step.value === AuthenticationStep.SendingMail) {
      _state.value = AuthenticationState.Progress;
      ajaxSendMail(formData, _secureToken.value)
        .then(data => {
          _secureToken.value = (data?.system as any)?.secureToken || '';
          _state.value = data.passwordSended ? AuthenticationState.Success : AuthenticationState.Error;
          // for testing only: mocking the link from mail
          if (state.value === AuthenticationState.Success) {
            setTimeout(() => {
              if (window.confirm('[Test env] Cliquer sur OK pour être redirigé sur l\'écran de saisie du nouveau mot de passe, annuler pour rester sur l\'écran actuel')) {
                window.location.search = '?wg_genere_password=test==';
              };
            }, 1000);
          };
        })
        .catch(err => {
          console.error(err);
          _state.value = AuthenticationState.Error;
        });
    }
  }

  function submitSetPassword(formData: FormData) {
    if (step.value === AuthenticationStep.DefiningPassword) {
      _state.value = AuthenticationState.Progress;
      ajaxSetPassword(formData, _secureToken.value)
        .then(data => {
          _secureToken.value = (data?.system as any)?.secureToken || '';
          _state.value = data.passwordChanged ? AuthenticationState.Success : AuthenticationState.Error;
          if (state.value === AuthenticationState.Success) {
            setTimeout(() => {
              window.location.search = ''; // recharge la page et enlève les param de l'url pour permettre de se reco directement
            }, 2000);
          }
        })
        .catch(err => {
          console.error(err);
          _state.value = AuthenticationState.Error;
        });
    }
  }

  return {
    userIsAuthenticated,
    state,
    step,
    logOut,
    checkSession,
    submitLogin,
    submitSendMail,
    submitSetPassword,
  };
});
