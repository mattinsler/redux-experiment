import invariant from 'invariant';
import { combineReducers } from 'redux';
import { autobind } from 'core-decorators';
import { connect as reduxConnect } from 'react-redux';

function connectToRedux(fn) {
  function mapStateToProps(state) {
    return { state };
  }

  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }

  function mergeProps(stateProps, dispatchProps, ownProps) {
    const { state } = stateProps;
    const { dispatch } = dispatchProps;

    return fn(state, dispatch, ownProps);
  }

  return function(target) {
    return reduxConnect(mapStateToProps, mapDispatchToProps, mergeProps)(target);
  };
}


class DataProvider {
  constructor(...plugins) {
    this.plugins = plugins;
    this.decorators = {};

    const reducers = {};
    const props = plugins
      .filter((p) => p && typeof(p.props) !== 'undefined')
      .map((p) => p.props);

    for (const plugin of plugins) {
      if (plugin.reducer) {
        invariant(plugin.name, 'DataProvider plugins must have a name');
        reducers[plugin.name] = plugin.reducer;
      }

      if (plugin.decorators) {
        for (const [key, decorator] of Object.entries(plugin.decorators)) {
          this.decorators[key] = function(...args) {
            return connectToRedux((state, dispatch, ownProps) => {
              console.log('...', state);
              const localState = state[key];
              return Object.assign(
                {},
                decorator(...args)(localState, dispatch, ownProps),
                ...props.map((p) => {
                  return typeof(p) === 'function' ? p({ state: localState, dispatch }) : p
                })
              );
            });
          };
        }
      }
    }

    this.reducer = combineReducers(reducers);
  }
}

  // @autobind
  // create(...creators) {
  //   const { plugins } = this;
  //
  //   // returns out the props to be injected
  //
  //   return connectToRedux(function(state, dispatch, ownProps) {
  //     const props = {};
  //
  //     for (const plugin of plugins) {
  //       for (const [key, value] of Object.entries(plugin({ dispatch, state }))) {
  //         if (!props[key]) {
  //           props[key] = value;
  //         }
  //       }
  //     }
  //
  //     return props;
  //   });

    //   for (const [name, action] of Object.entries(AUTH_ACTIONS)) {
    //     props[name] = function(...args) {
    //       return action.apply(props, [{ dispatch, state }, ...args]);
    //     }
    //   }
    //
    //       props.write = Object.entries(decoratorConfig).reduce((o, [k, v]) => {
    //         if (!endpoints[v]) {
    //           throw new Error(`Cannot find a key named ${v}`);
    //         }
    //
    //         function writer(data) {
    //           // key, endpoint, data
    //           return dispatch(writeRequest(k, keyToEndpointMap[v], data));
    //         }
    //         o[k] = Object.assign(writer, state[k]);
    //         return o;
    //       }, {});
    //
    //       return props;
    // });

export default DataProvider;
