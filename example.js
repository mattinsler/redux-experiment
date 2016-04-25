/** configure-fetch-provider.js **/

// This doesn't work if you run it... just for reference

import DataProvider from './data-provider';

import * as auth from './plugins/auth';
import fetch from './plugins/fetch';

const dataProvider = new DataProvider(
  auth,
  fetch({
    root: 'http://localhost:3000',
    endpoints: {
      session: '/user/sessions'
    },
    middleware: [ auth.middleware ] // adds auth headers to fetch calls
  })
);

const { decorators, reducer } = dataProvider;

export {
  decorators,
  reducer
};





/** create-store.js **/

import thunk from 'redux-thunk';
import { routerReducer as routing } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { reducer as fetch } from './configure-fetch-provider';

export default function() {
  return createStore(
    combineReducers({
      fetch,
      routing
    }),
    applyMiddleware(thunk)
  );
};


/** LoginForm.jsx **/

import React, { Component } from 'react';
import { autobind } from 'core-decorators';

import { decorators } from '../configure-fetch-provider';
const { create } = decorators;

@create('session')
class LoginForm extends Component {
  @autobind
  async submit(data, modified) {
    const res = await this.props.create.session(data);
    if (res.error) {
      console.log(res.error);
    } else if (res.data) {
      this.props.auth.login(res.data.token, res.data.user);
    }
  }

  render() {
    const { session: login } = this.props.create;
    console.log(this.props.auth.isAuthenticated());

    return (
      <Form onSubmit={ this.submit } onError={ this.onError }>
        <Fieldset disabled={ login.pending }>
          <Legend>Come on in!</Legend>

          <Input
            name="username"
            label="Email"
            type="email"
            required
            validator={ Validators.email }
          />
          <Input
            name="password"
            label="Password"
            type="password"
            whitespaceIsNotEmpty
            required
          />
          <Button color="primary" loading={ login.pending } onClick={ Form.submit }>Login</Button>
        </Fieldset>
      </Form>
    );
  }
}
