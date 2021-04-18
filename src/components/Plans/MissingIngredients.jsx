import { Checkbox, Dialog, FormControl, FormControlLabel, FormGroup, FormLabel } from "@material-ui/core";
import React from "react";
import { any, arrayOf, bool, func, shape, string } from "prop-types";
import { useTranslation } from "react-i18next";
import { checkOrUncheckIngredient } from "./plans.util";

/** Dialog that displays a plans missing ingredients and allows to check or uncheck them */
const MissingIngredients = (props) => {
  const { t } = useTranslation();
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const { planItem, closeDialog, onDoneEditing, open } = props;

  const checkIngredient = (ingredient) => {
    checkOrUncheckIngredient(planItem._id, ingredient, () => {
      onDoneEditing();
      forceUpdate();
    });
  }

  if(!planItem) return null;

  return (
    <Dialog open={open} onClose={closeDialog} >
      <FormControl style={{minWidth: '200px', padding: '1.5rem 2rem'}}>
        <FormLabel style={{marginBottom: '1rem'}}>{t('Missing Ingredients for {{plan}}', planItem.title)}</FormLabel>
        <FormGroup>
          {planItem.missingIngredients.map((ingredient) => (
            <FormControlLabel key={ingredient.name} control={<Checkbox checked={ingredient.checked} onChange={(event) => {checkIngredient(ingredient, event.target.checked);}} />} label={ingredient.name} />))}
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
