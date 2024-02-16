import React, { useEffect, useState } from 'react';
import { alpha, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { v4 as uuidv4 } from 'uuid';
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import BackButton from "../Buttons/BackButton";
import { useTranslation } from 'react-i18next';
import { addMeal, deleteAllImagesFromMeal } from "./meals.util";
import EditMealCore from "./EditMealCore";
import { useAuth0 } from "@auth0/auth0-react";
import { withLoginRequired } from "../util";
import DoneButton from "../Buttons/DoneButton";
import SavingButton from "../Buttons/SavingButton";

const useStyles = makeStyles(theme => ({
  form: {
    padding: '1rem 1.5rem',
    overflowY: 'auto',
  },
  waitForPictures: {
    fontSize: '0.9rem',
    color: theme.palette.error.main,
    textAlign: "right",
  },
  submitWithoutImagesButton: {
    margin: '0.5em 0 0 auto',
    display: 'block',
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.dark,
      backgroundColor: alpha(theme.palette.error.dark, 0.04),
    }
  },
  submitButton: {
    margin: '0.5em 0 0 auto',
    display: 'block',
  }
}));

/** page that allows adding a meal */
const AddMeal = () => {
  const classes = useStyles();
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth0();


  const emptyMeal = {
    _id: uuidv4(),
    userId: user ? user.sub : '',
    title: '',
    images: [],
    recipeLink: '',
    comment: '',
    isToTry: false,
    category: '',
    tags: [],
  };

  useEffect(() => {
    if (user) {
      updateMeal('userId', user.sub);
    }
  }, [user]);

  const [meal, setMeal] = useState(emptyMeal);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingImagesTakesLong, setLoadingImagesTakesLong] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateMeal = (key, value) => {
    setMeal(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  const goToMeals = () => {
    navigate('/meals/');
  }

  const onDoneAdding = (addedMeal) => {
    setIsSaving(false);
    goToMeals();
  };

  const addNewMeal = (event) => {
    event.preventDefault();
    setIsSaving(true);
    addMeal(meal, onDoneAdding);
  }

  const goBackAndDeleteImagesFromMeal = () => {
    if (meal.images && meal.images.length > 0) {
      deleteAllImagesFromMeal(meal._id);
    }
    navigate(-1);
  }

  return (
    <>
      <Navbar pageTitle={t('New Meal')} leftSideComponent={<BackButton onClick={goBackAndDeleteImagesFromMeal} />} rightSideComponent={meal.title && !isLoading ? <DoneButton onClick={addNewMeal} /> : null} />

      <form noValidate onSubmit={addNewMeal} className={classes.form}>
        <EditMealCore updateMeal={updateMeal} meal={meal} autoFocusFirstInput setImagesLoading={setIsLoading} setLoadingImagesTakesLong={setLoadingImagesTakesLong} />
        {meal.title && isLoading && loadingImagesTakesLong &&
          <>
            <Typography className={classes.waitForPictures} color="error">{t('LOADING_IMAGES_TAKES_LONG')}</Typography>
            <SavingButton isSaving={isSaving} type="submit" size="large" disabled={!meal.title} className={classes.submitWithoutImagesButton} variant='outlined'>{t('Add without images')}</SavingButton>
          </>
        }
        <SavingButton isSaving={isSaving} type="submit" size="large" disabled={!meal.title || isLoading} className={classes.submitButton} variant='contained' color='primary'>{t('Add')}</SavingButton>
      </form>

    </>
  );
}

export default withLoginRequired(AddMeal);
