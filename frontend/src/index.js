import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import 'whatwg-fetch';

import './index.scss';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';

import appState from './reducers';

const store = createStore(appState, applyMiddleware(thunk));

// Setup MindSphere OS Bar
// eslint-disable-next-line no-undef
_msb.init({
  title: "MindSphere Example App",
  appId: "_mscontent",
  appInfoPath: "app-info.json"
});

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('_mscontent')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
