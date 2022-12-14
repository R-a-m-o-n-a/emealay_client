import React, { useState } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from "react-i18next";
import { deleteUser } from "../Settings/settings.util";
import { useAuth0 } from "@auth0/auth0-react";

const useStyles = makeStyles(theme => ({
  logoutButton: {
    minWidth: '10rem',
    maxWidth: '60%',
    margin: '1.5em auto',
    display: "block",
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    }
  },
  confirmDeletionButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    }
  }
}));

const logoutRedirect = process.env.REACT_APP_LOGOUT_REDIRECT;

/** Login button including logout logic */
const DeleteAccountButton = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user, logout } = useAuth0();

  const [confirmDeletionDialogOpen, setConfirmDeletionDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [deletionInProgress, setDeletionInProgress] = useState(false);

  const openConfirmDeletionDialog = () => {
    setConfirmDeletionDialogOpen(true);
  }
  const closeConfirmDeletionDialog = () => {
    setConfirmDeletionDialogOpen(false);
  }

  const openConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  }
  const closeConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  }

  const deleteAccount = () => {
    if (user) {
      setDeletionInProgress(true);
      closeConfirmDeletionDialog();
      deleteUser(user.sub, () => {
        openConfirmationDialog();
        setDeletionInProgress(false);
      });
    }
  }

  const finalLogout = () => {
    logout({ returnTo: logoutRedirect });
  };

  return (
    <>
      <Button variant="contained" size="large" className={classes.logoutButton} onClick={openConfirmDeletionDialog}>
        {t('Delete Account')}
      </Button>
      <Dialog open={confirmDeletionDialogOpen} onClose={closeConfirmDeletionDialog}>
        <DialogTitle>{t('Are you sure you want to delete your Emealay Account?')}</DialogTitle>
        <DialogContent><DialogContentText>{t('This cannot be undone.')}</DialogContentText></DialogContent>
        <DialogActions style={{ justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={closeConfirmDeletionDialog}>{t('No, cancel.')}</Button>
          <Button className={classes.confirmDeletionButton} onClick={deleteAccount}>{t('Yes, delete my account for good.')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deletionInProgress} disableBackdropClick>
        <DialogTitle>{t('Your account is being deleted')}</DialogTitle>
        <DialogContent><CircularProgress /></DialogContent>
      </Dialog>
      <Dialog open={confirmationDialogOpen} onClose={closeConfirmationDialog} onBackdropClick={finalLogout}>
        <DialogTitle>{t('Your Account has been deleted')}</DialogTitle>
        <DialogContent><DialogContentText>{t('You will be logged out now.')}</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={finalLogout}>{t('OK')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteAccountButton;
