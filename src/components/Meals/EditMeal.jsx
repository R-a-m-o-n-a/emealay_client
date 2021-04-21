import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { arrayOf, bool, func, shape, string } from "prop-types";
import DeleteButton from "../Buttons/DeleteButton";
import { useTranslation } from "react-i18next";
import EditMealCore from "./EditMealCore";
import { deleteAllImagesFromMeal } from "./meals.util";
import Navbar from "../Navbar";
import BackButton from "../Buttons/BackButton";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading";
import useSnackbars from "../util/useSnackbars";
import DoneButton from "../Buttons/DoneButton";
import FullScreenDialog from "../util/FullScreenDialog";

const useStyles = makeStyles((theme) => ({
  form: {
    padding: '1em 1.5em',
    backgroundColor: theme.palette.background.default,
  },
  cancelButton: {
    textAlign: 'center',
    flexGrow: 4,
  },
  deleteButton: {
    textAlign: 'center',
  },
  saveButton: {
    textAlign: 'center',
    flexGrow: 4,
  },
  actionButtonWrapper: {
    margin: '1.5em 0 0',
  },
  snackbarOffset: {
    bottom: parseInt(process.env.REACT_APP_NAV_BOTTOM_HEIGHT) + 10 + 'px',
  },
  deleteSnackbar: {
    backgroundColor: theme.palette.error.light,
    width: '100%',
  },
  readdSnackbar: {
    backgroundColor: theme.palette.primary.light,
  },
}));

const inverseColors = true;
const serverURL = process.env.REACT_APP_SERVER_URL;

/** Dialog page that allows user to edit meal */
const EditMeal = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { closeDialog, onDoneEditing, onDoneDelete, meal: givenMeal, open } = props;

  const [meal, setMeal] = useState(givenMeal);

  const updateMeal = (key, value) => {
    setMeal(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  const [deleteImagesTimeout, setDeleteImagesTimeout] = useState(0);
  const [deletedItem, setDeletedItem] = useState(null);

  const undoDeletion = () => {
    clearTimeout(deleteImagesTimeout);
    setDeleteImagesTimeout(0);
    axios.post(serverURL + '/meals/add', deletedItem).then((result) => {
      console.log('re-add request sent', result.data);
      showReaddedItemMessage();
      onDoneEditing();
    });
  }

  const { Snackbars, showDeletedItemMessage, showReaddedItemMessage } = useSnackbars('Meal', deletedItem, undoDeletion);

  useEffect(() => {
    setMeal(givenMeal);
  }, [givenMeal])

  const editMeal = () => {
    if (meal.title) {
      axios.post(serverURL + '/meals/edit/' + meal._id, meal).then((result) => {
        console.log('edit request sent', result.data);
        onDoneEditing();
      });
    }
  }

  const deleteMeal = () => {
    axios.post(serverURL + '/meals/delete/' + meal._id).then((result) => {
      setDeletedItem(meal);
      setDeleteImagesTimeout(setTimeout(() => {
        deleteAllImagesFromMeal(meal._id, () => {
          updateMeal('images', []);
          setDeleteImagesTimeout(0);
        });
      }, 10000));
      showDeletedItemMessage();
      console.log('delete request sent', result.data);
      onDoneEditing();
      onDoneDelete();
      closeDialog();
    });
  }

  const editAndClose = (event) => {
    event.preventDefault();
    editMeal();
    closeDialog();
  }

  return (
    <>

      {meal ?
        <FullScreenDialog open={open} onClose={closeDialog}>
          <Navbar pageTitle={t('Edit Meal')}
                  leftSideComponent={<BackButton onClick={closeDialog} />}
                  rightSideComponent={meal.title ? <DoneButton onClick={editAndClose} /> : null}
                  secondary={inverseColors} />
          <form noValidate onSubmit={editAndClose} className={classes.form}>
            <EditMealCore updateMeal={updateMeal} meal={meal} isSecondary={inverseColors} />
            <Grid container spacing={0} justify="space-between" alignItems="center" wrap="nowrap" className={classes.actionButtonWrapper}>
              <Grid item xs className={classes.cancelButton}>
                <Button type="button" color={inverseColors ? "secondary" : "primary"} variant="outlined" onClick={closeDialog}>{t('Cancel')}</Button>
              </Grid>
              <Grid item xs className={classes.deleteButton}>
                <DeleteButton onClick={deleteMeal} />
              </Grid>
              <Grid item xs className={classes.saveButton}>
                <Button type="submit" disabled={!meal.title} color={inverseColors ? "secondary" : "primary"} variant="contained">{t('Save')}</Button>
              </Grid>
            </Grid>
          </form>
        </FullScreenDialog>
        : ''}

      {Snackbars}
    </>
  );
}

EditMeal.propTypes = {
  /** Meal to be edited */
  meal: shape({
    _id: string,
    title: string,
    images: arrayOf(shape({
      name: string,
      path: string,
    })),
    recipeLink: string,
    comment: string,
    category: string,
    tags: arrayOf(string),
  }),
  /** is component visible? */
  open: bool.isRequired,
  /** function to be executed after editing complete (receives no parameters) */
  onDoneEditing: func.isRequired,
  /** function to be executed after meal deletion complete (receives no parameters) */
  onDoneDelete: func.isRequired,
  /** function that closes Dialog / sets open to false */
  closeDialog: func.isRequired,
}

EditMeal.defaultProps = {
  meal: null,
}

export default withAuthenticationRequired(EditMeal, {
  onRedirecting: () => <Loading />,
});

