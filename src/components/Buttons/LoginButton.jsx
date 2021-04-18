import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  fontButton: {
    cursor: 'pointer',
  }
});

const LoginButton = () => {
  const classes = useStyles();
  const { loginWithRedirect } = useAuth0();
  const { t, i18n } = useTranslation();

  const login = async () => {
    await loginWithRedirect({ui_locales: i18n.language}); // login popup will be displayed in correct language
  }

  return (
    <Button color="primary" variant="contained" size="large" className={classes.fontButton} onClick={login}>
      {t('Login')}
    </Button>
  );
}

export default LoginButton;
