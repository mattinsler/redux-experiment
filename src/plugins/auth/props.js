import {
  login as loginAction,
  logout as logoutAction
} from './actions';

export default function({ dispatch, state }) {
  console.log(state);

  function login(token, user) {
    return dispatch(loginAction(token, user));
  }

  function logout() {
    return dispatch(logoutAction());
  }

  function getToken() {
    return state.__auth ? state.__auth.token : undefined;
  }

  function getUser() {
    return state.__auth ? state.__auth.user : undefined;
  }

  function isAuthenticated() {
    return !!getToken() && !!getUser();
  }

  return {
    auth: {
      login,
      logout,
      getToken,
      getUser,
      isAuthenticated
    }
  };
}
