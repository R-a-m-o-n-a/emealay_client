import React, { useState } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from "react-i18next";
import { deleteUser } from "../Settings/settings.util";
import { useAuth0 } from "@auth0/auth0-react";
import { useTracking } from "react-tracking";

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
  const { trackEvent } = useTracking({ module: 'delete-account' });

  const [confirmDeletionDialogOpen, setConfirmDeletionDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [deletionInProgress, setDeletionInProgress] = useState(false);

  const openConfirmDeletionDialog = () => {
    trackEvent({ event: 'open-delete-account-dialog' });
    setConfirmDeletionDialogOpen(true);
  }
  const closeConfirmDeletionDialog = () => {
    trackEvent({ event: 'close-delete-account-dialog' });
    setConfirmDeletionDialogOpen(false);
  }

  const openConfirmationDialog = () => {
    trackEvent({ event: 'open-account-deleted-dialog' });
    setConfirmationDialogOpen(true);
  }
  const closeConfirmationDialog = () => {
    trackEvent({ event: 'close-account-deleted-dialog' });
    setConfirmationDialogOpen(false);
  }

  const deleteAccount = () => {
    if (user) {
      setDeletionInProgress(true);
      closeConfirmDeletionDialog();
      trackEvent({ event: 'delete-account' });
      deleteUser(user.sub, () => {
        openConfirmationDialog();
        setDeletionInProgress(false);
      });
    }
  }

  const finalLogout = () => {
    logout({ returnTo: logoutRedirect });
  };

  const handleCloseDialog = (event, reason) => {
    console.log(event, reason);
    if (reason === 'backdropClick') {
      finalLogout();
    } else {
      closeConfirmationDialog();
    }
  }

  return (
    <>
      <Button variant="contained" size="large" className={classes.logoutButton} onClick={openConfirmDeletionDialog}>
        {t('Delete Account')}
      </Button>
      <Dialog open={confirmDeletionDialogOpen} onClose={closeConfirmDeletionDialog}>
        <DialogTitle>{t('Are you sure you want to delete your Emealia Account?')}</DialogTitle>
        <DialogContent><DialogContentText>{t('This cannot be undone.')}</DialogContentText></DialogContent>
        <DialogActions style={{ justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={closeConfirmDeletionDialog}>{t('No, cancel.')}</Button>
          <Button className={classes.confirmDeletionButton} onClick={deleteAccount}>{t('Yes, delete my account for good.')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deletionInProgress} onClose={() => {}}>
        <DialogTitle>{t('Your account is being deleted')}</DialogTitle>
        <DialogContent><CircularProgress /></DialogContent>
      </Dialog>
      <Dialog open={confirmationDialogOpen} onClose={handleCloseDialog}>
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
