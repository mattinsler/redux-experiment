import props from './props';
import reducer from './reducer';
import decorators from './decorators';

const name = 'auth';

function middleware(...args) {
  console.log('MIDDLE', args);
  // if (!opts.headers) { opts.headers = {} }
  // opts.headers =
}

export {
  name,
  decorators,
  middleware,
  props,
  reducer
};
