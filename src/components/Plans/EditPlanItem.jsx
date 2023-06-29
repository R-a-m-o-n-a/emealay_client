import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import DeleteButton from "../Buttons/DeleteButton";
import { useTranslation } from "react-i18next";
import Navbar from "../Navbar";
import EditPlanItemCore from "./EditPlanItemCore";
import BackButton from "../Buttons/BackButton";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading";
import DoneButton from "../Buttons/DoneButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSinglePlan } from "./plans.util";
import SavingButton from "../Buttons/SavingButton";

/** Dialog page that allows user to edit plan */
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
}));

const inverseColors = false;
const serverURL = process.env.REACT_APP_SERVER_URL;

/** page that allows editing a plan */
const EditPlanItem = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  let { planItemId } = useParams();
  const { user } = useAuth0();


  const [isSaving, setIsSaving] = useState(false);
  const [planItem, setPlanItem] = useState((state && state.planItem) ? state.planItem : null);

  // get planItem if it is not there
  useEffect(() => {
    if (!planItem) {
      if (state && state.planItem) {
        setPlanItem(state.planItem);
      } else if (planItemId) getSinglePlan(planItemId, setPlanItem);
    }
  }, [planItemId, state]); // eslint-disable-line react-hooks/exhaustive-deps

  const deletePlan = () => {
    axios.post(serverURL + '/plans/delete/' + planItem._id).then((result) => {
      //onDelete(planItem);
      console.log('delete request sent', result.data, planItem);
      navigate('/plans', {
        state: {
          snackbar: {
            category: 'Plan', // capital letter is important here because of output in useSnackbars
            deletedItem: planItem,
          }
        }
      });
    });
  }

  const editAndClose = (event) => {
    event.preventDefault();

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

      setIsSaving(true);
      axios.post(serverURL + '/plans/edit/' + planItem._id, newPlan).then((result) => {
        // editing done
        setIsSaving(false);
        goBackToPlans();
      });
    }
  }

  const goBackToPlans = () => {
    navigate(-1);
  }

  const updatePlanItem = (key, value) => {
    setPlanItem(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  return (
    planItem ?
      <>
        <Navbar pageTitle={t('Edit Plan')}
                leftSideComponent={<BackButton onClick={goBackToPlans} />}
                rightSideComponent={planItem.title ? <DoneButton onClick={editAndClose} /> : null}
                secondary={inverseColors} />

        <form noValidate onSubmit={editAndClose} className={classes.form}>
          <EditPlanItemCore planItem={planItem} updatePlanItem={updatePlanItem} isSecondary={inverseColors} />
          <Grid container spacing={0} justifyContent="space-between" alignItems="center" wrap="nowrap" className={classes.actionButtonWrapper}>
            <Grid item className={classes.cancelButton}>
              <Button type="button" color={inverseColors ? "secondary" : "primary"} size="large" variant="outlined" onClick={goBackToPlans}>{t('Cancel')}</Button>
            </Grid>
            <Grid item className={classes.deleteButton}>
              <DeleteButton onClick={deletePlan} />
            </Grid>
            <Grid item className={classes.saveButton}>
              <SavingButton isSaving={isSaving} type="submit" size="large" disabled={!planItem.title} color={inverseColors ? "secondary" : "primary"} variant="contained">{t('Save')}</SavingButton>
            </Grid>
          </Grid>
        </form>
      </> : ''
  );
}

export default withAuthenticationRequired(EditPlanItem, {
  onRedirecting: () => <Loading />,
});

