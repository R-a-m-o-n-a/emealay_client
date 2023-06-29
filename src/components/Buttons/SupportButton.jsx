import React from 'react';
import { Button } from '@material-ui/core';
import { Mail } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  supportButton: {
    marginTop: '1.7em',
    left: '50%',
    transform: 'translateX(-50%)',
  },
}));

const SupportButton = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleSupport = () => {
    window.location.href = 'mailto:emealay+help@gmail.com';
  }

  return (
    <Button variant="contained" color="secondary" size="large" className={classes.supportButton} onClick={handleSupport} endIcon={<Mail />}>
      {t('Help')}
    </Button>
  );
}

export default SupportButton;
