import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { darken, fade, lighten } from '@material-ui/core';
import Loading from "./Loading";
import i18n, { allLanguages } from "../i18n";

/**
 * This HOC wraps components in Auth0's withAuthenticationRequired HOC.
 * Additionally it detects and sets the language that is set in the query (z.B. .../plans?lang=de)
 * @param WrappedComponent
 * @returns {React.FC<object>} new Component that can be only accessed by logged in users and sets the language based on the query parameter
 * @public
 */
export const withLoginRequired = (WrappedComponent) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userLanguage = urlParams.get('lang');

  if (userLanguage) {
    if (i18n.language !== userLanguage) { // if language is not already set
      if (allLanguages.some(l => l.key === userLanguage)) {  // if language however is in the languages array
        i18n.changeLanguage(userLanguage).then(() => {'language changed to url param'});
      }
    }
  }

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
      ? lighten(fade(theme.palette.divider, 1), 0.88)
      : darken(fade(theme.palette.divider, 1), 0.68)
  }`;
}

export const dateStringOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

/**This is nothing, just to display the rest.*/
const util = () => {};
export default util;
