import reducer from './reducer';
import decorators from './decorators';

const name = 'fetch';

export default function(...args) {
  return {
    name,
    decorators: decorators(...args),
    reducer
  };
}
