import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import Navbar from "../Navbar";
import { useHistory } from "react-router-dom";
import BackButton from "../Buttons/BackButton";
import { useTranslation } from "react-i18next";
import EditPlanItemCore from "./EditPlanItemCore";
import { useAuth0 } from "@auth0/auth0-react";
import { withLoginRequired } from "../util";
import { func } from "prop-types";
import DoneButton from "../Buttons/DoneButton";

const useStyles = makeStyles(theme => ({
  form: {
    padding: '1em 2.5em',
    maxHeight: `calc(100% - 2rem - ${process.env.REACT_APP_NAV_TOP_HEIGHT}px)`,
    overflowY: 'auto',
  },
  submitButton: {
    margin: '1.5em 0 0 auto',
    display: 'block',
  }
}));

const serverURL = process.env.REACT_APP_SERVER_URL;

/** page that allows adding a plan */
const AddPlanItem = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const { t } = useTranslation();
  const { user } = useAuth0();

  const { onDoneAdding } = props;

  const emptyPlanItem = {
    title: '',
    hasDate: false,
    date: new Date(),
    gotEverything: true,
    missingIngredients: [],
    connectedMeal: null,
  };

  const [planItem, setPlanItem] = useState(emptyPlanItem);

  const updatePlanItem = (key, value) => {
    setPlanItem(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  const addNewPlan = (event) => {
    event.preventDefault();
    console.log('adding ' + planItem.title + ' with connected planItem', planItem.connectedMeal);
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

      axios.post(serverURL + '/plans/add', newPlan).then((result) => {
        console.log('add request sent', result.data);
        onDoneAdding();
      });
    }
  }

  return (
    <>
      <Navbar pageTitle={t('New Plan')}
              leftSideComponent={<BackButton onClick={() => {history.goBack()}} />}
              rightSideComponent={planItem.title ? <DoneButton label={t('Done')} onClick={addNewPlan} /> : null} />
      <form noValidate onSubmit={addNewPlan} className={classes.form}>
        <EditPlanItemCore updatePlanItem={updatePlanItem} planItem={planItem} isAdd autoFocusFirstInput />
        <Button type="submit" disabled={!planItem.title} className={classes.submitButton} variant='contained' color='primary'>{t('Add Plan')}</Button>
      </form>
    </>
  );
}

AddPlanItem.propTypes = {
  /** function to be executed after Plan was added (receives no parameters) */
  onDoneAdding: func,
};

export default withLoginRequired(AddPlanItem);

