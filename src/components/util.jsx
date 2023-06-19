import React from "react";
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";
import { alpha, darken, lighten } from '@material-ui/core';
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

/*
 * the refresh tokens and use of localstorage were added because the login did not persist on page refresh in firefox and safari
 * according to this article https://community.auth0.com/t/why-is-authentication-lost-after-refreshing-my-single-page-application/56276
 */

export const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {
  const navigate = useNavigate();

  // if redirect isn't working properly, maybe because the appState is not set: https://community.auth0.com/t/auth0-react-spa-onredirectcallback-redirection-solution/42013
  const onRedirectCallback = (appState) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };

  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} useRefreshTokens cacheLocation="localstorage" {...props}>
      {children}
    </Auth0Provider>
  );
};

/**
 * This HOC wraps components in Auth0's withAuthenticationRequired HOC.
 * @param WrappedComponent
 * @returns new Component that can be only accessed by logged in users
 * @public
 */
export const withLoginRequired = (WrappedComponent) => {

  return withAuthenticationRequired(WrappedComponent, {
    onRedirecting: () => <Loading />,
  });
}

/**
 * This implementation of the Material-UI table border is taken directly from the TableCell component in order to add a border-top to tables without TableHead
 * @param theme - MUI theme
 * @returns {string} - '1px solid theRightColor'
 * @public
 */
export const muiTableBorder = (theme) => {
  return `1px solid
    ${
    theme.palette.type === 'light'
      ? lighten(alpha(theme.palette.divider, 1), 0.88)
      : darken(alpha(theme.palette.divider, 1), 0.68)
  }`;
}

export const dateStringOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };


