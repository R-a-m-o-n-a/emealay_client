import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import BackButton from "../Buttons/BackButton";
import { useTranslation } from "react-i18next";
import EditPlanItemCore from "./EditPlanItemCore";
import { useAuth0 } from "@auth0/auth0-react";
import { withLoginRequired } from "../util";
import { any, array, arrayOf, bool, func, shape, string } from "prop-types";
import DoneButton from "../Buttons/DoneButton";
import { addPlan } from "./plans.util";
import SavingButton from "../Buttons/SavingButton";
import { useTracking } from "react-tracking";

const useStyles = makeStyles(theme => ({
  form: {
    padding: '1.5em 2.5em',
    overflowY: 'auto',
  },
  submitButton: {
    margin: '1.5em 0 0 auto',
    display: 'block',
  }
}));

/** page that allows adding a plan */
const AddPlanItem = (props) => {
  const classes = useStyles();
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth0();

  const { onDoneAdding, presetPlanItem, backFunction } = props;

  const emptyPlanItem = {
    title: '',
    hasDate: false,
    date: new Date(),
    gotEverything: true,
    missingIngredients: [],
    connectedMeal: null,
  };

  const [planItem, setPlanItem] = useState(presetPlanItem || emptyPlanItem);
  const [isSaving, setIsSaving] = useState(false);

  const { Track, trackEvent } = useTracking({ page: 'add-plan' });

  const updatePlanItem = (key, value) => {
    setPlanItem(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  const addNewPlan = (event) => {
    event.preventDefault();
    // console.log('adding ' + planItem.title + ' with connected planItem', planItem.connectedMeal);
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
      addPlan(newPlan, (addedPlan) => {
        setIsSaving(false);
        trackEvent({ event: 'added-new-plan', planId: addedPlan._id });
        if (onDoneAdding) {
          onDoneAdding();
        } else {
          navigate('/plans');
        }
      });
    }
  }

  const autoFocusTitle = !(presetPlanItem && presetPlanItem.title);

  return (
    <Track>
      <Navbar pageTitle={t('New Plan')}
              leftSideComponent={<BackButton onClick={backFunction ? backFunction : () => {navigate(-1)}} />}
              rightSideComponent={planItem.title ? <DoneButton label={t('Done')} onClick={addNewPlan} /> : null} />
      <form noValidate onSubmit={addNewPlan} className={classes.form}>
        <EditPlanItemCore updatePlanItem={updatePlanItem} planItem={planItem} autoFocusFirstInput={autoFocusTitle} />
        <SavingButton isSaving={isSaving} type="submit" disabled={!planItem.title} className={classes.submitButton} variant='contained' size="large" color='primary'>{t('Add Plan')}</SavingButton>
      </form>
    </Track>
  );
}

AddPlanItem.propTypes = {
  /** function to be executed after Plan was added (receives no parameters) */
  onDoneAdding: func,
  /** optional plan item to start adding an item with values already filled it */
  presetPlanItem: shape({
    title: string,
    hasDate: bool,
    date: any,
    gotEverything: bool,
    missingIngredients: array,
    connectedMeal: shape({
      _id: string,
      title: string,
      images: arrayOf(shape({
        name: string,
        url: string,
      })),
      recipeLink: string,
      comment: string,
      category: string,
      tags: arrayOf(string),
      isPrivate: bool,
      isToTry: bool,
    }),
  }),
  backFunction: func,
};

export default withLoginRequired(AddPlanItem);

