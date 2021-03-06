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
import DoneButton from "../Buttons/DoneButton";

/** Dialog page that allows user to edit plan */
const useStyles = makeStyles((theme) => ({
  form: {
    padding: '1em 1.5em',
    backgroundColor: theme.palette.background.default,
    height: `calc(100% - ${process.env.REACT_APP_NAV_BOTTOM_HEIGHT}px)`,
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
}));

const inverseColors = true;
const serverURL = process.env.REACT_APP_SERVER_URL;

/** page that allows editing a plan */
const EditPlanItem = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useAuth0();

  const { closeDialog, onDoneEditing, onDelete, planItem: givenPlanItem } = props;

  const [planItem, setPlanItem] = useState(givenPlanItem);

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
      onDelete(planItem);
      console.log('delete request sent', result.data);
      onDoneEditing();
      closeDialog();
    });
  }

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
    planItem &&
    <>
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
  /** function to be executed after editing complete (receives no parameters) */
  onDoneEditing: func.isRequired,
  /** function to be executed after deleting an item (receives deleted item as parameter) */
  onDelete: func.isRequired,
  /** function that closes Dialog / sets open to false */
  closeDialog: func.isRequired,
}

EditPlanItem.defaultProps = {
  planItem: null,
}

export default withAuthenticationRequired(EditPlanItem, {
  onRedirecting: () => <Loading />,
});

