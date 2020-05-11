export function signInRequest(email, password, navPageActiveAccount) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { email, password, navPageActiveAccount },
  };
}

export function signInSuccess(token, user) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { token, user },
  };
}

export function signUpRequest(name, email, password, privacy, resetForm) {
  return {
    type: '@auth/SIGN_UP_REQUEST',
    payload: { name, email, password, privacy, resetForm },
  };
}

export function tokenUpRequest(token) {
  return {
    type: '@auth/TOKEN_UP_REQUEST',
    payload: { token },
  };
}

export function signSuccess() {
  return { type: '@auth/SIGN_SUCCESS' };
}

export function signFailure() {
  return { type: '@auth/SIGN_FAILURE' };
}

export function sigUpFailure() {
  return { type: '@user/SIGNUP_FAILURE' };
}

export function signOut() {
  return {
    type: '@auth/SIGN_OUT',
  };
}

export function acceptionRegulation(newPrivacy) {
  return {
    type: '@auth/ACCEPT_REGULATION',
    payload: { newPrivacy },
  };
}

export function createImage(data) {
  return {
    type: '@auth/CREATE_IMAGE',
    payload: { data },
  };
}

export function updateImage(data) {
  return {
    type: '@auth/UPDATE_IMAGE',
    payload: { data },
  };
}
