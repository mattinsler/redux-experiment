import URL from 'url';
import querystring from 'querystring';
import { fetch } from './actions';

function collect(arr, accessor) {
  return arr.reduce((o, key) => {
    o[key] = accessor(key);
    return o;
  }, {});
}

export default function({
  root = window.location.origin,
  endpoints = {},
  middleware = []
}) {
  root = root.replace(/\/+$/, '');

  function createFetchOpts(method, url, data = {}) {
    const opts = {
      method: method.toUpperCase(),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    if (!/^(file|http|https):\/\//.test(url)) {
      url = root + '/' + url.replace(/^\/+/, '');
    }

    const parsedUrl = URL.parse(url, true);

    const hash = parsedUrl.hash ? parsedUrl.hash.slice(1) : '';
    const query = { ...parsedUrl.query };

    if (Object.keys(data).length > 0) {
      if (~[ 'POST', 'PATCH', 'PUT', 'DELETE' ].indexOf(method.toUpperCase())) {
        opts.body = JSON.stringify(data);
      } else {
        Object.assign(query, data);
      }
    }

    return [
      [
        parsedUrl.protocol,
        '//',
        parsedUrl.host,
        parsedUrl.pathname,
        Object.keys(query).length > 0 ? '?' + querystring.stringify(query) : '',
        hash ? '#' + hash : ''
      ].join(''),
      opts
    ];
  }

  function create(...creators) {
    return (state, dispatch, ownProps) => {
      const endpointMap = collect(creators, (c) => {
        if (!endpoints[c]) { throw new Error(`No endpoint named ${c}`); }
        return endpoints[c];
      });

      return {
        create: Object.entries(endpointMap).reduce((o, [key, url]) => {
          function creator(data) {
            const fetchOpts = createFetchOpts('post', url, data);

            for (const middle of middleware) {
              middle(state, fetchOpts);
            }

            return dispatch(fetch(key, fetchOpts, data));
          }

          o[key] = Object.assign(creator, state[key]);
          return o;
        }, {})
      };
    };
  }

  function read() {
    return {};
  }

  function update() {
    return {};
  }

  function destroy() {
    return {};
  }

  return {
    create,
    read,
    update,
    destroy
  };
}
