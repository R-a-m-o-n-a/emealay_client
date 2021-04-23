import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import DeleteButton from "../Buttons/DeleteButton";
import { useTranslation } from "react-i18next";
import { any, arrayOf, bool, func, shape, string } from "prop-types";
import Navbar from "../Navbar";
import EditPlanItemCore from "./EditPlanItemCore";
import BackButton from "../Buttons/BackButton";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading";
import useSnackbars from "../util/useSnackbars";
import DoneButton from "../Buttons/DoneButton";
import FullScreenDialog from "../util/FullScreenDialog";

/** Dialog page that allows user to edit plan */
const useStyles = makeStyles((theme) => ({
  form: {
    padding: '1em 1.5em',
    backgroundColor: theme.palette.background.default,
    height: `calc(100% - ${process.env.REACT_APP_NAV_BOTTOM_HEIGHT}px)`,
  },
  submitButton: {
    margin: '1.5em 0 0',
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
  },
  readdSnackbar: {
    backgroundColor: theme.palette.primary.light,
  },
}));

const inverseColors = true;
const serverURL = process.env.REACT_APP_SERVER_URL;

const EditPlanItem = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useAuth0();

  const { closeDialog, onDoneEditing, planItem: givenPlanItem, open } = props;

  const [planItem, setPlanItem] = useState(givenPlanItem);

  const [deletedItem, setDeletedItem] = useState(null);

  useEffect(() => {
    if (givenPlanItem) {
      const newPlanItem = givenPlanItem;
      newPlanItem.date = givenPlanItem.date ? new Date(givenPlanItem.date) : new Date();
      newPlanItem.connectedMeal = givenPlanItem.connectedMeal || null;
      setPlanItem(newPlanItem);
    }
  }, [givenPlanItem]);

  const editPlan = () => {
    if (planItem.title && user) {
      const newPlan = {
        userId: user.sub,
        title: planItem.title,
        hasDate: planItem.hasDate,
        date: planItem.hasDate ? new Date(planItem.date) : null,
        gotEverything: planItem.gotEverything,
        missingIngredients: planItem.missingIngredients,
        connectedMealId: planItem.connectedMeal ? planItem.connectedMeal._id : null,
      }

      axios.post(serverURL + '/plans/edit/' + planItem._id, newPlan).then((result) => {
        console.log('edit request sent', result.data);
        onDoneEditing();
      });
    }
  }

  const deletePlan = () => {
    axios.post(serverURL + '/plans/delete/' + planItem._id).then((result) => {
      setDeletedItem(planItem);
      showDeletedItemMessage();
      console.log('delete request sent', result.data);
      onDoneEditing();
      closeDialog();
    });
  }

  const undoDeletion = () => {
    axios.post(serverURL + '/plans/add', deletedItem).then((result) => {
      console.log('re-add request sent', result.data);
      showReaddedItemMessage();
      onDoneEditing();
    });
  }

  const { Snackbars, showDeletedItemMessage, showReaddedItemMessage } = useSnackbars('Plan', deletedItem, undoDeletion);

  const editAndClose = (event) => {
    event.preventDefault();
    editPlan();
    closeDialog();
  }

  const updatePlanItem = (key, value) => {
    setPlanItem(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  return (
    <>{planItem ?
      <FullScreenDialog open={open} onClose={closeDialog}>
        <Navbar pageTitle={t('Edit Plan')}
                leftSideComponent={<BackButton onClick={closeDialog} />}
                rightSideComponent={planItem.title ? <DoneButton onClick={editAndClose} /> : null}
                secondary={inverseColors} />

        <form noValidate onSubmit={editAndClose} className={classes.form}>
          <EditPlanItemCore planItem={planItem} updatePlanItem={updatePlanItem} isSecondary={inverseColors} />
          <Grid container spacing={0} justify="space-between" alignItems="center" wrap="nowrap" className={classes.actionButtonWrapper}>
            <Grid item xs className={classes.cancelButton}>
              <Button type="button" color={inverseColors ? "secondary" : "primary"} variant="outlined" onClick={closeDialog}>{t('Cancel')}</Button>
            </Grid>
            <Grid item xs className={classes.deleteButton}>
              <DeleteButton onClick={deletePlan} />
            </Grid>
            <Grid item xs className={classes.saveButton}>
              <Button type="submit" disabled={!planItem.title} color={inverseColors ? "secondary" : "primary"} variant="contained">{t('Save')}</Button>
            </Grid>
          </Grid>
        </form>
      </FullScreenDialog>
      : ''}
      {Snackbars}
    </>
  );
}

EditPlanItem.propTypes = {
  /** plan to be edited */
  planItem: shape({
    title: string,
    hasDate: bool,
    date: any,
    gotEverything: bool,
    missingIngredients: arrayOf(shape({
      name: string,
      checked: bool,
    })),
    connectedMealId: string,
  }),
  /** is component visible? */
  open: bool.isRequired,
  /** function to be executed after editing complete (receives no parameters) */
  onDoneEditing: func.isRequired,
  /** function that closes Dialog / sets open to false */
  closeDialog: func.isRequired,
}

EditPlanItem.defaultProps = {
  planItem: null,
}

export default withAuthenticationRequired(EditPlanItem, {
  onRedirecting: () => <Loading />,
});

