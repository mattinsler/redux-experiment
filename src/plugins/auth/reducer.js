import {
  keys,
  LOGIN,
  LOGOUT
} from './constants';

const token = JSON.parse(window.localStorage.getItem(keys.TOKEN));
const user = JSON.parse(window.localStorage.getItem(keys.USER));

const INITIAL_STATE = { __auth: { token, user } };

function reducer(state = INITIAL_STATE, { type, ...action }) {
  switch (type) {
    case LOGIN:
      return {
        ...state,
        __auth: {
          token: action.token,
          user: action.user
        }
      };
    case LOGOUT:
      return {
        ...state,
        __auth: INITIAL_STATE.__auth
      };
    default:
      return state;
  }
}

export default reducer;
