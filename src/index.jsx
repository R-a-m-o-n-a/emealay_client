import React from 'react';
import ReactDOM from 'react-dom';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './i18n';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import ServiceWorkerUpdateService from "./components/ServiceWorkerUpdateService";

const loginRedirect = process.env.REACT_APP_LOGIN_REDIRECT;
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

ReactDOM.render(
  <Auth0Provider domain={domain} clientId={clientId} redirectUri={loginRedirect}>
    <BrowserRouter>
      <ServiceWorkerUpdateService />
      <App />
    </BrowserRouter>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();
