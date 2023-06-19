import React from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import Navbar from "./Navbar";
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem",
    fontFamily: "Cookie",
    fontSize: "1.3rem",
    lineHeight: "1.4rem",
  },
  loadingCircle: {
    display: "block",
    margin: "auto",
  }
});

/**
 * Shows a whole page that says loading... (including the Navbar)
 * @component
 */
const Loading = () => {
  return (
    <>
      <Navbar pageTitle="Emealay" />
      <LoadingBody />
    </>
  )
    ;
}

/**
 * Shows content "loading..." and a circular progress (**not** including the Navbar)
 * @component
 */
export const LoadingBody = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Typography className={classes.infoText}>{t('Loading')}...</Typography>
      <CircularProgress className={classes.loadingCircle} />
    </>
  )
    ;
}

export default Loading;

