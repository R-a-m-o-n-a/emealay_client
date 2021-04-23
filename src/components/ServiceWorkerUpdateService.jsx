import React, { useEffect } from 'react';
import { Snackbar, Button } from '@material-ui/core';
import * as serviceWorker from '../serviceWorkerRegistration';

/**
 * notifies the user when a new version is available and lets them trigger an update.
 * Without this, the app  would only update once the user has closed all active tabs
 * Source: https://felixgerschau.com/create-a-pwa-update-notification-with-create-react-app/ */
const ServiceWorkerUpdateService = () => {
  const [showReload, setShowReload] = React.useState(false);
  const [waitingWorker, setWaitingWorker] = React.useState(null);

  const onSWUpdate = (registration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorker.register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload(true);
  };

  return (
    <Snackbar
      open={showReload}
      message={t('A new version of the app is available!')}
      onClick={reloadPage}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      action={
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          onClick={reloadPage}
        >
          {t('Reload')}
        </Button>
      }
    />
  );
}

export default ServiceWorkerUpdateService;
