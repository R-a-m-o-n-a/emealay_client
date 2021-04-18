import React, { useEffect, useState } from 'react';
import { Box, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { arrayOf, bool, func, shape, string } from "prop-types";
import EditMeal from "./EditMeal";
import Navbar from "../Navbar";
import BackButton from "../Buttons/BackButton";
import ImageGrid from "../Images/ImageGrid";
import { useTranslation } from "react-i18next";
import EditButton from "../Buttons/EditButton";
import FullScreenDialog from "../util/FullScreenDialog";
import { fetchAndUpdateMeal } from "./meals.util";

const serverURL = process.env.REACT_APP_SERVER_URL;

const useStyles = makeStyles((theme) => ({
  content: {
    padding: '1em',
    maxHeight: `calc(100% - ${process.env.REACT_APP_NAV_TOP_HEIGHT}px)`,
    overflowY: 'auto',
    backgroundColor: theme.palette.background.default,
  },
}));

/** Dialog page that displays Meal Details and optionally opens Edit Dialog */
const MealDetailView = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { meal: initialMeal, open, closeDialog, onDoneEditing, allowEditing, extern } = props;

  const [meal, setMeal] = useState(initialMeal);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [mealBeingEdited, setMealBeingEdited] = useState(null);

  useEffect(() => {
    setMeal(initialMeal);
  }, [initialMeal]);

  const fetchMeal = () => {
    if (meal && meal._id) {
      fetchAndUpdateMeal(meal._id, setMeal);
    }
  }

  const openEditItemDialog = (mealItem) => {
    setMealBeingEdited(mealItem);
    console.log('setting as toEdit', mealBeingEdited, mealItem, mealBeingEdited === mealItem)
    setEditDialogOpen(allowEditing && true);
  }

  const afterEditing = () => {
    onDoneEditing();
    fetchMeal();
  }

  return (
    <>
      {meal ?
        <FullScreenDialog open={open} onClose={closeDialog}>
          <Navbar pageTitle={t('Meal')}
                  rightSideComponent={allowEditing && <EditButton onClick={() => {openEditItemDialog(meal)}} />}
                  leftSideComponent={extern ? null : <BackButton onClick={closeDialog} />} />
          <Box className={classes.content}>
            <Typography variant="h4">{meal.title}</Typography>
            {meal.recipeLink ?
              <>
                <Typography><Link href={meal.recipeLink}>{meal.recipeLink}</Link></Typography>
              </> : ''}
            {meal.comment ?
              <>
                <Typography>{meal.comment}</Typography>
              </> : ''}
            {meal.images && meal.images.length > 0 ? <ImageGrid images={meal.images} allowChoosingMain={false} /> : ''}
          </Box>
        </FullScreenDialog>
        : ''}

      {!extern && <EditMeal open={allowEditing && editDialogOpen} meal={mealBeingEdited} closeDialog={() => {
        setMealBeingEdited(null);
        setEditDialogOpen(false);
      }} onDoneEditing={afterEditing} onDoneDelete={() => {
        afterEditing();
        closeDialog();
      }} />}
    </>
  );
}

MealDetailView.propTypes = {
  /** meal to be viewed */
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
  open: bool,
  /** function that sets open to false */
  closeDialog: func.isRequired,
  /** function to be executed after editing (receives no parameters) */
  onDoneEditing: func,
  /** allow opening edit page? (To be false if not one's own meal) */
  allowEditing: bool,
  /** extern is coming from a link might not be logged in */
  extern: bool,
}

MealDetailView.defaultProps = {
  meal: null,
  open: true,
  allowEditing: false,
  extern: false,
}

export default MealDetailView;

