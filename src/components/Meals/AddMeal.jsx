import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { v4 as uuidv4 } from 'uuid';
import Navbar from "../Navbar";
import { useHistory } from "react-router-dom";
import BackButton from "../Buttons/BackButton";
import { useTranslation } from 'react-i18next';
import { addMeal, deleteAllImagesFromMeal } from "./meals.util";
import EditMealCore from "./EditMealCore";
import { useAuth0 } from "@auth0/auth0-react";
import { withLoginRequired } from "../util";
import { func } from "prop-types";
import DoneButton from "../Buttons/DoneButton";

const useStyles = makeStyles(theme => ({
  form: {
    padding: '1rem 1.5rem',
    maxHeight: `calc(100% - 2rem - ${process.env.REACT_APP_NAV_TOP_HEIGHT}px)`,
    overflowY: 'auto',
  },
  submitButton: {
    margin: '0.5em 0 0 auto',
    display: 'block',
  }
}));

/** page that allows adding a meal */
const AddMeal = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const { t } = useTranslation();
  const { user } = useAuth0();

  const { onDoneAdding } = props;

  const emptyMeal = {
    _id: uuidv4(),
    userId: user ? user.sub : '',
    title: '',
    images: [],
    recipeLink: '',
    comment: '',
    category: '',
    tags: [],
  };

  useEffect(() => {
    if (user) {
      updateMeal('userId', user.sub);
    }
  }, [user]);

  const [meal, setMeal] = useState(emptyMeal);
  const [loading, setLoading] = useState(false);

  const updateMeal = (key, value) => {
    setMeal(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  const addNewMeal = (event) => {
    event.preventDefault();
    addMeal(meal, onDoneAdding);
  }

  return (
    <>
      <Navbar pageTitle={t('New Meal')} leftSideComponent={<BackButton onClick={() => {
        if (meal.images) {
          deleteAllImagesFromMeal(meal._id);
        }
        history.goBack();
      }} />} rightSideComponent={meal.title && !loading ? <DoneButton onClick={addNewMeal} /> : null} />

      <form noValidate onSubmit={addNewMeal} className={classes.form}>
        <EditMealCore updateMeal={updateMeal} meal={meal} autoFocusFirstInput setImagesLoading={setLoading} />
        <Button type="submit" disabled={!meal.title || loading} className={classes.submitButton} variant='contained' color='primary'>{t('Add')}</Button>
      </form>

    </>
  );
}

AddMeal.propTypes = {
  /** function to be executed after Meal was added (receives no parameters) */
  onDoneAdding: func,
};

export default withLoginRequired(AddMeal);
