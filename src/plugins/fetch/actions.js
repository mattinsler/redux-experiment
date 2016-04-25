import isoFetch from 'isomorphic-fetch';

import {
  REQUEST,
  SUCCESS,
  FAILURE
} from './constants';

function request(key, data) {
  return {
    type: REQUEST,
    key,
    data
  }
}

function success(key, data) {
  return {
    type: SUCCESS,
    key,
    data
  };
}

function failure(key, error) {
  return {
    type: FAILURE,
    key,
    error
  }
}

function fetch(key, opts, data) {
  return function(dispatch) {
    dispatch(request(key, data));
    console.log(opts);
    return isoFetch(...opts).then(
      async (resData) => dispatch(success(key, await resData.json())),
      (err) => dispatch(failure(key, err))
    );
  }
}

export {
  failure,
  fetch,
  request,
  success
};
