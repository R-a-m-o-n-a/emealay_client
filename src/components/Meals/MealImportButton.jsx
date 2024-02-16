import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Grid, IconButton, Snackbar } from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import { withLoginRequired } from "../util";
import { arrayOf, bool, shape, string } from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { faChevronRight, faFileImport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditMealCore from "./EditMealCore";
import FullScreenDialog from "../util/FullScreenDialog";
import Navbar from "../Navbar";
import DoneButton from "../Buttons/DoneButton";
import BackButton from "../Buttons/BackButton";
import { addMeal, copyMealImages, deleteAllImagesFromMeal } from "./meals.util";
import Alert from "@material-ui/lab/Alert";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  importButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1.5rem',
    color: theme.palette.background.default,
  },
  form: {
    padding: '1rem 1.5rem 1.5rem',
    overflowY: 'auto',
  },
  snackbar: {
    bottom: 10 + 'px',
    color: theme.palette.primary.contrastText,
  },
  successSnackbar: {
    backgroundColor: theme.palette.primary[theme.palette.type],
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center",
  },
}));

/** This Button allows importing a meal frrom another user into one's own meals. It contains all the importing functionality. */
const MealImportButton = (props) => {
  const { t } = useTranslation();
  const { user } = useAuth0();
  const classes = useStyles();
  const { meal } = props;
  let navigate = useNavigate();

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [newMeal, setNewMeal] = useState(meal);
  const [importAllowed, setImportAllowed] = useState(false);
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  useEffect(() => {
    if (importDialogOpen && meal && user) {
      setImportAllowed(meal.images.length === 0); // nothing to load
      const { title, recipeLink, comment } = meal;
      const mealCopy = {
        _id: uuidv4(),
        userId: user.sub,
        title,
        recipeLink,
        comment,
        category: null,
        isToTry: true,
        tags: [],
      };

      copyMealImages(meal._id, mealCopy._id, (newImages) => {
        updateNewMeal('images', newImages ?? []);
        setImportAllowed(true);
      });

      setNewMeal(mealCopy);
    }
  }, [importDialogOpen, user, meal]);

  const updateNewMeal = (key, value) => {
    setNewMeal(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  const submitImport = (event) => {
    event.preventDefault();
    addMeal(newMeal, () => {
      setSuccessMessageOpen(true);
      closeDialog();
    });
  }

  if (!user) {
    return null;
  } else if (user.sub === meal.userId) {
    return null;
  }

  function importMeal() {
    setImportDialogOpen(true);
  }

  const goToMeals = () => {navigate('/meals');};

  const cancel = () => {
    if(newMeal.images.length > 0) deleteAllImagesFromMeal(newMeal._id);
    closeDialog();
  }

  const closeDialog = () => {
    setImportDialogOpen(false);
  };

  return <>
    <IconButton title={t('Import into my meals')} onClick={importMeal} className={classes.importButton}><FontAwesomeIcon icon={faFileImport} /></IconButton>
    <FullScreenDialog open={importDialogOpen} onClose={closeDialog}>
      <Navbar pageTitle={t('Import Meal')}
              secondary
              rightSideComponent={importAllowed ? (meal.title ? <DoneButton onClick={submitImport} /> : null) : <CircularProgress color="inherit" size={25} />}
              leftSideComponent={<BackButton onClick={cancel} />} />
      <form noValidate onSubmit={submitImport} className={classes.form}>
        <EditMealCore meal={newMeal} updateMeal={updateNewMeal} isSecondary={true} />
        <Grid container spacing={0} justifyContent="space-between" alignItems="center" wrap="nowrap">
          <Grid item xs>
            <Button type="button" color="secondary" variant="outlined" onClick={cancel}>{t('Cancel')}</Button>
          </Grid>
          <Grid item xs style={{ textAlign: 'right' }}>
            <Button type="submit"
                    disabled={!meal.title || !importAllowed}
                    variant='contained'
                    color='primary'
                    startIcon={importAllowed ? <FontAwesomeIcon icon={faFileImport} /> : <CircularProgress color="inherit" size={20} />}>
              {t('Import')}
            </Button>
          </Grid>
        </Grid>

      </form>
    </FullScreenDialog>
    <Snackbar open={successMessageOpen} autoHideDuration={4000} onClose={() => {
      setSuccessMessageOpen(false);
    }} className={classes.snackbar}>
      <Alert action={<Button color="inherit" variant="outlined" size="small" endIcon={<FontAwesomeIcon icon={faChevronRight} />} onClick={goToMeals}>{t('Go to my meals')}</Button>}
             icon={<CheckCircle />}
             variant="filled"
             className={classes.successSnackbar}>
        {t('Successfully imported meal')}
      </Alert>
    </Snackbar>
  </>;
}

MealImportButton.propTypes = {
  /** meal to be imported */
  meal: shape({
    _id: string,
    userId: string,
    title: string,
    images: arrayOf(shape({
      name: string,
      url: string,
    })),
    recipeLink: string,
    comment: string,
    category: string,
    isToTry: bool,
    tags: arrayOf(string),
  }).isRequired,
}

export default withLoginRequired(MealImportButton);
