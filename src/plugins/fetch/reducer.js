import {
  REQUEST,
  SUCCESS,
  FAILURE
} from './constants';

const INITIAL_STATE = {};

function reducer(state = INITIAL_STATE, { type, ...action }) {
  switch (type) {
    case REQUEST:
      return {
        ...state,
        [action.key]: {
          pending: true,
          failure: false,
          success: false
        }
      };
    case SUCCESS:
      return {
        ...state,
        [action.key]: {
          pending: false,
          failure: false,
          success: true,
          data: action.data
        }
      };
    case FAILURE:
      return {
        ...state,
        [action.key]: {
          pending: false,
          failure: true,
          success: false,
          error: action.error
        }
      };
    default:
      return state;
  }
}

export default reducer;
