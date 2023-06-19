import React from 'react';
import { alpha, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  logoutButton: {
    minWidth: '10rem',
    maxWidth: '60%',
    margin: '1.7em auto 1em',
    display: "block",
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.dark,
      backgroundColor: alpha(theme.palette.error.dark, 0.04),
    }
  },
}));

const logoutRedirect = process.env.REACT_APP_LOGOUT_REDIRECT;

/** Login button including logout logic */
const LogoutButton = () => {
  const classes = useStyles();
  const { logout } = useAuth0();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout({ returnTo: logoutRedirect });
  }

  return (
    <Button variant="outlined" size="large" className={classes.logoutButton} onClick={handleLogout}>
      {t('Logout')}
    </Button>
  );
}

export default LogoutButton;
