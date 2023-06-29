import React, { useState } from 'react';
import { Fab } from '@material-ui/core';
import { arrayOf, shape, string } from "prop-types";
import { useTranslation } from "react-i18next";
import FullScreenDialog from "./FullScreenDialog";
import AddPlanItem from "../Plans/AddPlanItem";
import { useNavigate } from "react-router-dom";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  fab: {
    position: "fixed",
    bottom: `calc(2rem + ${process.env.REACT_APP_NAV_BOTTOM_HEIGHT}px)`,
    right: "2rem",
  },
  planIcon: {
    marginRight: '8px',
    fontSize: '1.2rem',
  }
});

/** Button that opens native share API on the devices or provides the link if API is not supported */
const PlanMealButton = (props) => {
  const classes = useStyles();
  const { meal } = props;
  const { t } = useTranslation();
  const [isPlanMealDialogOpen, setIsPlanMealDialogOpen] = useState(false);

  let navigate = useNavigate();

  const newPlanItem = {
    title: meal.title,
    hasDate: false,
    date: new Date(),
    gotEverything: true,
    missingIngredients: [],
    connectedMeal: meal,
  };

  const onDoneAdding = () => {
    closePlanMealDialog();
    navigate('/plans');
  }

  const openPlanMealDialog = () => {
    setIsPlanMealDialogOpen(true);
  }
  const closePlanMealDialog = () => {
    setIsPlanMealDialogOpen(false);
  }

  return (
    <>
      <Fab variant="extended" color="secondary" className={classes.fab} onClick={openPlanMealDialog}>
        <FontAwesomeIcon icon={faClipboardList} className={classes.planIcon} />
        {t('Plan Meal')}
      </Fab>
      <FullScreenDialog open={isPlanMealDialogOpen}>
        <AddPlanItem onDoneAdding={onDoneAdding} presetPlanItem={newPlanItem} backFunction={closePlanMealDialog} />
      </FullScreenDialog>
    </>
  );
}

PlanMealButton.propTypes = {
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
}

export default PlanMealButton;
