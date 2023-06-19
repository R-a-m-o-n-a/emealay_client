import React from 'react';
import ReactDOM from 'react-dom';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './i18n';
import { BrowserRouter } from "react-router-dom";
import ServiceWorkerUpdateService from "./components/ServiceWorkerUpdateService";
import { Auth0ProviderWithRedirectCallback } from "./components/util";
import App from "./App";

//const loginRedirect = process.env.REACT_APP_LOGIN_REDIRECT;
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

ReactDOM.render(
  <BrowserRouter>
    <Auth0ProviderWithRedirectCallback domain={domain} clientId={clientId} redirectUri={window.location.origin}>
      <ServiceWorkerUpdateService />
      <App />
    </Auth0ProviderWithRedirectCallback>
  </BrowserRouter>,
  document.getElementById('root')
);
