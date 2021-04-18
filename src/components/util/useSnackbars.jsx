import React, { useState } from 'react';
import { Button, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from "react-i18next";
import CircularProgressWithLabel from "../util/CircularProgressWithLabel";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  snackbarOffset: {
    bottom: parseInt(process.env.REACT_APP_NAV_BOTTOM_HEIGHT) + 10 + 'px',
  },
  deleteSnackbar: {
    backgroundColor: theme.palette.error[theme.palette.type],
    width: '100%',
  },
  readdSnackbar: {
    backgroundColor: theme.palette.primary[theme.palette.type],
  },
}));

/**
 * Custom Hook that provides Snackbar Messages for deletion and restoring of objects
 * @param {string} category   name of category to be displayed, e.g., 'Plan' or 'Meal'
 * @param {Object} deletedItem  item that was deleted
 * @param {function} undoDeletion  function that restored the deletedItem
 * @returns {{Snackbars: Object, showDeletedItemMessage: function, showReaddedItemMessage: function}}
 * Snackbars: React Component that displays the Snackbars when applicable if included at any point in return function
 * showDeletedItemMessage: true when deleted message should be displayed
 * showReaddedItemMessage: true when restored message should be displayed
 */
export default function useSnackbars(category, deletedItem, undoDeletion) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [deleteMessageVisible, setDeleteMessageVisible] = useState(false);
  const [readdedMessageVisible, setReaddedMessageVisible] = useState(false);

  const showDeletedItemMessage = () => {
    setDeleteMessageVisible(true);
  }

  const showReaddedItemMessage = () => {
    setDeleteMessageVisible(false);
    setReaddedMessageVisible(true);
  }

  const Snackbars = (
    <>
      <Snackbar open={deleteMessageVisible} autoHideDuration={5000} onClose={() => {setDeleteMessageVisible(false); }} className={classes.snackbarOffset}>
        <Alert action={<Button color="inherit" size="small" onClick={undoDeletion}>{t('Undo')}</Button>}
               icon={<CircularProgressWithLabel initialValue={5} />}
               variant="filled"
               className={classes.deleteSnackbar}>
          {deletedItem ? t(`${category} {{title}} deleted`, { title: deletedItem.title }) : t(`${category} deleted`)}
        </Alert>
      </Snackbar>

      <Snackbar open={readdedMessageVisible}
                autoHideDuration={2000}
                onClose={() => {setReaddedMessageVisible(false); }}
                message={deletedItem ? t(`${category} {{title}} re-added`, { title: deletedItem.title }) : t(`${category} re-added`)}
                className={classes.snackbarOffset}
                ContentProps={{ className: classes.readdSnackbar }} />
    </>
  );

  return {
    Snackbars, showDeletedItemMessage, showReaddedItemMessage
  };
}
