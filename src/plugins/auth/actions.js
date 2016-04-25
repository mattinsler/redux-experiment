import {
  keys,
  LOGIN,
  LOGOUT
} from './constants';

function login(token, user) {
  window.localStorage.setItem(keys.TOKEN, JSON.stringify(token));
  window.localStorage.setItem(keys.USER, JSON.stringify(user));

  return {
    type: LOGIN,
    token,
    user
  };
}

function logout() {
  window.localStorage.removeItem(keys.TOKEN);
  window.localStorage.removeItem(keys.USER);

  return {
    type: LOGOUT
  };
}

export {
  login,
  logout
};
