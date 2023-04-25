// mocks server-side data
let systemIsAuthenticated = false;
let secureToken = '';

// ref: FW www\gcs\js\gcs\gcs.core.js $.gcs.getAjaxConfig
function getRequestOptions(data?: {[key: string]: any}) {
  const formDataStart = {
    'postStart': '1',
    'tabSessionId': 'deprecated',
  };

  const formDataEnd = {
    'postEnd': '1',
    'cs_secureToken': typeof secureToken === 'string' ? secureToken : '',
    'windowWidth': 'deprecated',
    'windowHeight': 'deprecated',
  };

  const formData: {[key: string]: string} = {};
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    Object.keys(data).forEach(key => {
      formData[encodeURIComponent(key)] = encodeURIComponent(data[key]);
    });
  }

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: new URLSearchParams({...formDataStart, ...formData, ...formDataEnd}).toString(),
  };
}

// helper for mocking server response according to payload
function getFromRequestPayload(payload: any, key: string) {
  return new URLSearchParams(payload.body).get(key);
}

function getResponseJson(res: any): Promise<any> {
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.indexOf("application/json") !== -1;
  if (res.ok && isJson) {
    return res.json();
  } else {
    throw Error('No ok / no json');
  }
}

function mockServerResponse(data: {[key: string]: any}): Response {
  console.log('mock response', data);
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    },
  );
}

// mocks the smarty variable passed to FW FW2.0\GCS\tpl\admin\page\log.phtml
export function hasTemporaryPassword(): boolean {
  let hasTempPwd = false;
  const query = window.location?.search;
  if (typeof query === 'string' && query.trim().length) {
    const urlParams = new URLSearchParams(query);
    const newPwdToken = urlParams.get('wg_genere_password');
    hasTempPwd = newPwdToken === 'test==';
  }
  return hasTempPwd;
}

export function ajaxLogout(token: string): Promise<{system: {isAuthenticated: boolean}}> {
  const payload = getRequestOptions();

  const mockRequest: Promise<Response> = new Promise((resolve, reject) => {
    console.log('mocking fetch request to "gcs/ajax/authentification-destroy" with payload:', payload);
    setTimeout(() => {
      if (token !== secureToken) {
        reject('secureToken mismatch');
      } else {
        systemIsAuthenticated = false;
        secureToken = '';
  
        resolve(
          mockServerResponse({
            system: {
              isAuthenticated: systemIsAuthenticated,
              secureToken,
            },
          }),
        );
      }
    }, 500);
  });

  return mockRequest.then(getResponseJson);
}

export function ajaxCheckSession(token: string) {
  const payload = getRequestOptions();

  const mockRequest: Promise<Response> = new Promise((resolve, reject) => {
    console.log('mocking fetch request to "gcs/ajax/authentification-check" with payload:', payload);
    setTimeout(() => {
      if (token !== secureToken) {
        reject('secureToken mismatch');
      } else {
        secureToken = systemIsAuthenticated ? Date.now().toString() : '';
        resolve(
          mockServerResponse({
            system: {
              isAuthenticated: systemIsAuthenticated,
              secureToken, // null if isAuthenticated is false
              isSuspended: false, 
            },
          }),
        );
      }
    }, 2000);
  });

  return mockRequest.then(getResponseJson);
}

export function ajaxLogin(data: FormData, token: string) {
  const payload = getRequestOptions({
    gcsLogin: data.get('gcs_login'),
    gcsPassword: data.get('gcs_password'),
    gcsRemember: Boolean(data.get('gcs_remember_me')),
  });

  const mockRequest: Promise<Response> = new Promise((resolve, reject) => {
    console.log('mocking fetch request to "gcs/ajax/authentification-check" with payload:', payload);
    setTimeout(() => {
      if (token !== secureToken) {
        reject('secureToken mismatch');
      } else {
        const login = getFromRequestPayload(payload, 'gcsLogin');
        const pwd = getFromRequestPayload(payload, 'gcsPassword');
        if (login && decodeURIComponent(login) === 'test' && pwd && decodeURIComponent(pwd) === '123') {
          systemIsAuthenticated = true;
        }
        secureToken = systemIsAuthenticated ? Date.now().toString() : '';
        resolve(
          mockServerResponse({
            system: {
              isAuthenticated: systemIsAuthenticated,
              secureToken,
              isSuspended: false, 
            },
          }),
        );
      }
    }, 2000);
  });

  return mockRequest.then(getResponseJson);
}

export function ajaxSendMail(data: FormData, token: string) {
  const payload = getRequestOptions({
    gcsMail: data.get('gcs_mail'),
  });

  const mockRequest: Promise<Response> = new Promise((resolve, reject) => {
    console.log('mocking fetch request to "gcs/ajax/authentification-send-password" with payload:', payload);
    setTimeout(() => {
      if (token !== secureToken) {
        reject('secureToken mismatch');
      } else {
        const mail = getFromRequestPayload(payload, 'gcsMail');
        secureToken = systemIsAuthenticated ? Date.now().toString() : '';
        resolve(
          mockServerResponse({
            system: {
              isAuthenticated: systemIsAuthenticated,
              secureToken,
              isSuspended: false, 
            },
            passwordSended: mail && decodeURIComponent(mail)  === 'test@test.com',
          }),
        );
      }
    }, 2000);
  });

  return mockRequest.then(getResponseJson);
}

export function ajaxSetPassword(data: FormData, token: string) {
  const payload = getRequestOptions({
    gcsPassword: data.get('gcs_password_recovery'),
    gcsPasswordConfirm: data.get('gcs_password_recovery_confirm'),
    location: window.location,
  });

  const mockRequest: Promise<Response> = new Promise((resolve, reject) => {
    console.log('mocking fetch request to "gcs/ajax/authentification-recover-password" with payload:', payload);
    setTimeout(() => {
      if (token !== secureToken) {
        reject('secureToken mismatch');
      } else {
        secureToken = systemIsAuthenticated ? Date.now().toString() : '';
        const password = getFromRequestPayload(payload, 'gcsPassword');
        const passwordConfirm = getFromRequestPayload(payload, 'gcsPasswordConfirm');

        const response: any = {
          system: {
            isAuthenticated: systemIsAuthenticated,
            secureToken,
            isSuspended: false,
          },
        };

        if (typeof password  !== 'string' || password.trim().length === 0 || password !== passwordConfirm) {
          response.passwordChangeInvalid = true;
        } else {
          response.passwordChanged = true;
        }

        resolve(
          mockServerResponse(response),
        );
      }
    }, 2000);
  });

  return mockRequest.then(getResponseJson);
}
