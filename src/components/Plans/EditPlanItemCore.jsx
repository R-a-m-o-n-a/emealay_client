import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Grid, TextField } from '@material-ui/core';
// import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { any, arrayOf, bool, func, shape, string } from "prop-types";
import dateformat from 'dateformat';
import { useTranslation } from "react-i18next";
import { Autocomplete } from "@material-ui/lab";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading";
import { fetchAndUpdateMealsFromUser } from "../Meals/meals.util";

const useStyles = makeStyles((theme) => ({
  dateSelectionWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  dateLabel: {
    marginTop: 'calc(10px + 0.5em)',
    marginBottom: 'calc(10px + 0.5em)',
  },
  dateSelection: {
    marginTop: '.5em',
    marginBottom: '.5em',
    marginLeft: 'auto',
  },
  textField: {
    width: '100%',
    marginTop: '1em',
    marginBottom: '1em',
  },
  buttonGridCell: {
    maxWidth: 'calc(2em + 8px)',
    flexGrow: 1,
    flexBasis: 0,
    textAlign: 'center',
  },
  missingIngredientsBox: {
    paddingLeft: '2em',
    marginTop: '0.5em',
  },
  newIngredientInputGrid: {
    marginBottom: '0.5em',
  },
  addIngredientButton: {
    borderRadius: '100%',
    minWidth: '1em',
    padding: 0,
    color: theme.palette.background.default,
  },
  addIngredientButtonIcon: {
    color: theme.palette.primary.main,
  },
  removeIngredientButtonIcon: {
    color: theme.palette.error.light,
  },
  missingIngredientsGrid: {
    flexWrap: "nowrap",
  },
  missingIngredientLeftGridCell: {
    width: 'calc(100% - 2em - 8px)',
  },
  missingIngredientItem: {
    display: 'flex',
    marginRight: 0,
  },
  missingIngredientCheckbox: {
    padding: '5px 9px',
  },
  missingIngredientInputLabel: { // needs to be one single line
    maxWidth: '100%',
    whiteSpace: 'nowrap',
  },
  missingIngredientLabel: { // needs to be one single line
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}));

/** component is used by AddPlanItem and EditPlanItem and provides their shared input elements
 *  Does not handle communication to server */
const EditPlanItemCore = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useAuth0();

  const {
    isAdd,
    updatePlanItem,
    planItem: {
      title,
      hasDate,
      date,
      gotEverything,
      missingIngredients,
      connectedMeal,
    },
    isSecondary,
    autoFocusFirstInput,
  } = props;

  const colorA = isSecondary ? "primary" : "secondary";
  const colorB = isSecondary ? "secondary" : "primary";

  const [newIngredient, setNewIngredient] = useState('');
  const [inputValueUpdateAllowed, setInputValueUpdateAllowed] = useState(isAdd || !!connectedMeal); // if connectedMeal is null the Autocomplete input will overwrite the title, so the first change needs to be prohibited

  const [meals, setMeals] = useState([]);

  const updateMealsCallback = (mealsFound) => {
    setMeals(mealsFound);
  }

  useEffect(() => {
    if (user && user.sub) fetchAndUpdateMealsFromUser(user.sub, updateMealsCallback);
  }, [user]);

  const addIngredient = () => {
    const ingredientToAdd = {
      name: newIngredient,
      checked: false,
    }
    const updatedIngredients = missingIngredients;
    updatedIngredients.push(ingredientToAdd);
    updatePlanItem('missingIngredients', updatedIngredients);
    setNewIngredient('');
  }

  const setIngredientChecked = (ingredient, newCheckedStatus) => {
    const updatedIngredients = missingIngredients;
    updatedIngredients.forEach(i => i.checked = (i === ingredient) ? newCheckedStatus : i.checked);
    updatePlanItem('missingIngredients', updatedIngredients);
    // forceUpdate(); might be unnecessary after all
  }

  const removeIngredient = (ingredient) => {
    const updatedIngredients = missingIngredients.filter(i => i !== ingredient);
    console.log(updatedIngredients);
    updatePlanItem('missingIngredients', updatedIngredients);
  }

  return (
    <>
      <Autocomplete id="planTitle" freeSolo clearOnBlur={false} clearOnEscape={false} value={connectedMeal} onChange={(event, newValue) => {
        updatePlanItem('connectedMeal', newValue);
      }} inputValue={title} onInputChange={(event, newInputValue) => {
        if (inputValueUpdateAllowed) {
          updatePlanItem('title', newInputValue);
        } else {
          setInputValueUpdateAllowed(true);
        }
      }} onClose={(event, reason) => {
        if (reason === 'create-option' && event.key === 'Enter') {
          setInputValueUpdateAllowed(false);
        }
      }} options={meals} getOptionLabel={(option) => option.title || ''} renderInput={(params) => (
        <TextField {...params} color={colorB} className={classes.textField} label={t('Title')} variant="outlined" autoFocus={autoFocusFirstInput} required />
      )} />
      <Box className={classes.dateSelectionWrapper}>
        <FormControlLabel className={classes.dateLabel} label={t('Date')} control={
          <Checkbox checked={hasDate} onChange={e => updatePlanItem('hasDate', e.target.checked)} color={colorB} />
        } />
        {hasDate ?
          <TextField className={classes.dateSelection}
                     value={dateformat(date, 'yyyy-mm-dd')}
                     onChange={e => updatePlanItem('date', e.target.value)}
                     label={t('Due Date')}
                     type="date"
                     color={colorB}
                     variant="outlined"
                     InputLabelProps={{ shrink: true, }} />
          : ''}
      </Box>
      <FormControlLabel label={t('Got everything?')} control={
        <Checkbox checked={gotEverything} onChange={e => updatePlanItem('gotEverything', e.target.checked)} color={colorB} />
      } />
      <Box className={classes.missingIngredientsBox} hidden={gotEverything}>
        <Grid container spacing={1} justify="space-between" alignItems="flex-end" className={classes.newIngredientInputGrid}>
          <Grid item xs style={{ width: 'calc(100% - (2em + 8px))' }}>
            <TextField value={newIngredient} color={colorA} name="newIngredient" onChange={e => setNewIngredient(e.target.value)} onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                if (newIngredient) addIngredient();
              }
            }} label={t('Missing Ingredient')} InputLabelProps={{ className: classes.missingIngredientInputLabel }} variant="standard" />
          </Grid>
          <Grid item className={classes.buttonGridCell}>
            <Button type="button"
                    disabled={!newIngredient}
                    className={classes.addIngredientButton}
                    onClick={addIngredient}
                    variant='text'><FontAwesomeIcon className={classes.addIngredientButtonIcon} icon={faPlusCircle} size="2x" /></Button>
          </Grid>
        </Grid>

        {missingIngredients.map((ingredient, index) =>
          <Grid container spacing={1} justify="space-between" alignItems="center" key={index + ingredient.name} className={classes.missingIngredientsGrid}>
            <Grid item className={classes.missingIngredientLeftGridCell}>
              <FormControlLabel label={ingredient.name} classes={{ root: classes.missingIngredientItem, label: classes.missingIngredientLabel }} control={
                <Checkbox className={classes.missingIngredientCheckbox}
                          checked={ingredient.checked}
                          onChange={e => setIngredientChecked(ingredient, e.target.checked)}
                          color={colorA} />
              } />
            </Grid>
            <Grid item className={classes.buttonGridCell}>
              <Button type="button"
                      className={classes.addIngredientButton}
                      onClick={() => {removeIngredient(ingredient)}}
                      variant='text'><FontAwesomeIcon className={classes.removeIngredientButtonIcon} icon={faMinusCircle} size="lg" /></Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
}

EditPlanItemCore.propTypes = {
  /** is this component called from AddPlanItem page?
   * This is necessary because the MUI Autocomplete component is still a lab component and does not work 100% properly, so I had to implement a workaround that needs this info
   */
  isAdd: bool,
  /** setState function of the parent component's planItem that takes key and value of attribute and updates it */
  updatePlanItem: func.isRequired,
  /** planItem to be edited */
  planItem: shape({
    title: string,
    hasDate: bool,
    date: any,
    gotEverything: bool,
    missingIngredients: arrayOf(shape({
      name: string,
      checked: bool,
    })),
    connectedMealId: string,
  }).isRequired,
  /** whether to use primary or secondary color scheme */
  isSecondary: bool,
  /** whether to autofocus title input (will open keyboard on smartphones) */
  autoFocusFirstInput: bool,
}

EditPlanItemCore.defaultProps = {
  isAdd: false,
  isSecondary: false,
  autoFocusFirstInput: false,
}

export default withAuthenticationRequired(EditPlanItemCore, {
  onRedirecting: () => <Loading />,
});

