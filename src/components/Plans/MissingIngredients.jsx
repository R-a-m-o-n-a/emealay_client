import { Checkbox, CircularProgress, Dialog, FormControl, FormControlLabel, FormGroup, FormLabel } from "@material-ui/core";
import React, { useState } from "react";
import { any, arrayOf, bool, func, shape, string } from "prop-types";
import { useTranslation } from "react-i18next";
import { checkOrUncheckIngredient } from "./plans.util";

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  dialogHeading: {
    lineHeight: '1.5rem',
    marginBottom: '0.5rem',
  },
  dialog: {
    minWidth: '200px',
    padding: '1.5rem 2rem',
  },
  loadingCircle: {
    margin: '10px',
    color: theme.palette.secondary.main,
  }
}));

/** Dialog that displays a plan's missing ingredients and allows to check or uncheck them */
const MissingIngredients = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [isIngredientLoading, setIsIngredientLoading] = useState({});
  const { planItem, closeDialog, onDoneEditing, open } = props;

  function updateIsIngredientLoading(ingredient, value) {
    setIsIngredientLoading(prevState => ({ ...prevState, [ingredient.name]: value }));
  }

  const checkIngredient = (ingredient) => {
    updateIsIngredientLoading(ingredient, true);
    checkOrUncheckIngredient(planItem._id, ingredient, () => {
      updateIsIngredientLoading(ingredient, false);
      onDoneEditing();
    });
  }

  if (!planItem) return null;

  return (
    <Dialog open={open} onClose={closeDialog}>
      <FormControl className={classes.dialog}>
        <FormLabel className={classes.dialogHeading}>{t('Missing Ingredients for {{plan}}', { plan: planItem.title })}</FormLabel>
        <FormGroup>
          {planItem.missingIngredients.map((ingredient) => (
            <FormControlLabel key={ingredient.name} control={isIngredientLoading?.[ingredient?.name] ?
              <CircularProgress size={22} color="inherit" className={classes.loadingCircle} />
              : <Checkbox checked={ingredient.checked} onChange={(event) => {checkIngredient(ingredient, event.target.checked);}} />} label={ingredient.name} />))}
        </FormGroup>
      </FormControl>
    </Dialog>
  );
}

MissingIngredients.propTypes = {
  /** planItem whose ingredients are to be displayed */
  planItem: shape({
    _id: string,
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
  /** is component visible? */
  open: bool.isRequired,
  /** function to be executed after an ingredient is checked or unchecked (receives no parameters) */
  onDoneEditing: func.isRequired,
  /** function that closes Dialog / sets open to false */
  closeDialog: func.isRequired,
}

MissingIngredients.defaultProps = {
  planItem: null,
}

export default MissingIngredients;
