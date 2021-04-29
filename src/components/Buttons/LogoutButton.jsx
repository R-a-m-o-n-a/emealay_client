import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  logoutButton: {
    minWidth: '10rem',
    maxWidth: '60%',
    margin: '1.5em auto',
    display: "block",
  },
}));

const logoutRedirect = process.env.REACT_APP_LOGOUT_REDIRECT;

/** Login button including logout logic */
const LogoutButton = () => {
  const classes = useStyles();
  const { logout } = useAuth0();
  const { t } = useTranslation();

  return (
    <Button color="secondary" variant="outlined" size="large" className={classes.logoutButton} onClick={() => logout({ returnTo: logoutRedirect})}>
      {t('Logout')}
    </Button>
  );
}

export default LogoutButton;
