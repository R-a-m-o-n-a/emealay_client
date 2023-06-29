import React, { useEffect, useState } from 'react';
import { alpha, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
// import { arrayOf, func, shape, string } from "prop-types";
import DeleteButton from "../Buttons/DeleteButton";
import { useTranslation } from "react-i18next";
import EditMealCore from "./EditMealCore";
import { fetchAndUpdateMeal } from "./meals.util";
import Navbar from "../Navbar";
import BackButton from "../Buttons/BackButton";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading";
import DoneButton from "../Buttons/DoneButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SavingButton from "../Buttons/SavingButton";
import { deleteSingleImage } from "../Images/images.util";

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
  submitWithoutImagesButton: {
    margin: '1em auto 0.5em',
    display: 'block',
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.dark,
      backgroundColor: alpha(theme.palette.error.dark, 0.04),
    }
  },
  actionButtonWrapper: {
    margin: '1.5em 0 1em',
  },
}));

const inverseColors = false;
const serverURL = process.env.REACT_APP_SERVER_URL;

/** Dialog page that allows user to edit meal */
const EditMeal = () => {
  const classes = useStyles();
  const { user } = useAuth0();
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  let { mealId } = useParams();
  

  const [meal, setMeal] = useState();
  const [originalMealImages, setOriginalMealImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [loadingImagesTakesLong, setLoadingImagesTakesLong] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (user && meal) {
    if(user.sub !== meal.userId) {
      console.log('not allowed, this is not your meal');
      navigate('/meals/detail/' + meal._id, { state: { meal, mealContext: 'social' } });
    }
  }

  useEffect(() => {
    fetchAndUpdateMeal(mealId, (mealFromDB) => {
      setMeal(mealFromDB);
      if (mealFromDB.images) setOriginalMealImages(Array.from(mealFromDB.images));
    });
  }, [mealId]);

  // set the meal that is given in state as a temporary option while the one from the server is loaded
  if (!meal) {
    if (state && state.meal) setMeal(state.meal);
  }

  const updateMeal = (key, value) => {
    setMeal(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  const deleteMeal = () => {
    axios.post(serverURL + '/meals/delete/' + meal._id).then((result) => {
      const deletedMeal = result.data.meal;
      // console.log('delete request sent for meal ', deletedMeal._id);
      navigate('../', {
        state: {
          snackbar: {
            category: 'Meal', // capital letter is important here because of output in useSnackbars
            deletedItem: deletedMeal,
          }
        }
      });
    });
  }

  const editAndClose = (event) => {
    event.preventDefault();
    setIsSaving(true);
    if (meal.title && user.sub === meal.userId) {
      axios.post(serverURL + '/meals/edit/' + meal._id, meal).then((result) => {
        // console.log('edit request sent', result.data);
        setIsSaving(false);
        navigate(-1); // state has no effect when navigating to -1 because it takes the old state
      });
    }
  }

  const cancelCloseEdit = () => {

    // delete images that should not be saved
    const imagesToDelete = meal.images.filter(i => !originalMealImages.includes(i));
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach(image => {
        deleteSingleImage(image, () => {console.log('deleted', image)});
      });
    }

    // todo right now images that get deleted do not get restored when cancel is clicked.
    //  might consider either doing that or deleting them only on save
    navigate(-1); // state has no effect when navigating to -1 because it takes the old state
  }

  return (
    <>
      <Navbar pageTitle={t('Edit Meal')}
              leftSideComponent={<BackButton onClick={cancelCloseEdit} />}
              rightSideComponent={meal && meal.title && !imagesLoading ? <DoneButton onClick={editAndClose} /> : null}
              secondary={inverseColors} />
      {meal ?
        <form noValidate onSubmit={editAndClose} className={classes.form}>
          <EditMealCore updateMeal={updateMeal} meal={meal} isSecondary={inverseColors} setImagesLoading={setImagesLoading} setLoadingImagesTakesLong={setLoadingImagesTakesLong} />
          <Grid container spacing={0} justifyContent="space-between" alignItems="center" wrap="nowrap" className={classes.actionButtonWrapper}>
            <Grid item className={classes.cancelButton}>
              <Button type="button" color={inverseColors ? "secondary" : "primary"} size="large" variant="outlined" onClick={cancelCloseEdit}>{t('Cancel')}</Button>
            </Grid>
            <Grid item className={classes.deleteButton}>
              <DeleteButton onClick={deleteMeal} />
            </Grid>
            <Grid item className={classes.saveButton}>
              <SavingButton isSaving={isSaving}
                            type="submit"
                            size="large"
                            disabled={!meal.title || imagesLoading}
                            color={inverseColors ? "secondary" : "primary"}
                            variant="contained">{t('Save')}</SavingButton>
            </Grid>
          </Grid>
          {meal.title && imagesLoading && loadingImagesTakesLong &&
            <SavingButton isSaving={isSaving}
                          type="submit"
                          size="large"
                          className={classes.submitWithoutImagesButton}
                          disabled={!meal.title}
                          variant="outlined">{t('Save without new images')}</SavingButton>}
        </form>
        : ''}
    </>
  );
}
/*
EditMeal.propTypes = {
  /!** Meal to be edited *!/
  meal: shape({
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
  }),
  /!** function to be executed after editing complete (receives no parameters) *!/
  onDoneEditing: func.isRequired,
  /!** function to be executed after meal deletion complete (receives no parameters) *!/
  onDoneDelete: func.isRequired,
}

EditMeal.defaultProps = {
  meal: null,
}*/

export default withAuthenticationRequired(EditMeal, {
  onRedirecting: () => <Loading />,
});

