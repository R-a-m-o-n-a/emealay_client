import { List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { array, func, string } from "prop-types";
import { useTranslation } from "react-i18next";
import { checkOrUncheckIngredient, getPlansOfUser } from "./plans.util";
import { makeStyles } from "@material-ui/styles";
import { dateStringOptions } from "../util";

const useStyles = makeStyles((theme) => ({
  listHeading: {
    fontFamily: "Cookie",
    fontSize: "1.7rem",
    textDecoration: "underline",
    lineHeight: "1.6rem",
  },
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem",
    fontFamily: "Cookie",
    fontSize: "1.5rem",
    lineHeight: "1.6rem",
  },
  listItemTextTypography: {
    fontSize: '1rem',
  },
  indentedSubheader: {
    paddingLeft: '2rem',
    lineHeight: '2rem',
    color: theme.palette.primary.main,
  },
  primary: {
    color: theme.palette.primary.main,
  },
  secondary: {
    color: theme.palette.secondary.main,
  }
}));

// todo: Should crossed off ingredients be eliminated from the list?
//  If yes, when/what action will trigger this? If yes, may need to add a field to missingIngredients database model
/** Displays a list of all ingredients of future plans (ingredients of past plans will not be displayed)
 * + checked ingredients will be displayed with a line through the text
 * + allows checking off and unchecking items from the list by clicking on them
 * + orders ingredients by date and meal */
const ShoppingList = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { userId, onClose, plans: plansFromProps } = props;

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [plans, setPlans] = useState(plansFromProps);
  const [dateIngredientMap,] = useState(new Map());

  const fetchAndUpdatePlans = () => {
    getPlansOfUser(userId, setPlans);
  }

  useEffect(() => {
    if (!plansFromProps) {
      fetchAndUpdatePlans();
    } else {
      setPlans(plansFromProps);
    }
    // eslint-disable-next-line
  }, [plansFromProps]);

  useEffect(() => {
    if (plans) {
      dateIngredientMap.clear();
      plans.forEach((plan) => {
        const planIsInPast = plan.hasDate && new Date(plan.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
        if (!planIsInPast && plan.missingIngredients && plan.missingIngredients.length > 0) {
          const key = plan.hasDate && plan.date ? new Date(plan.date).setHours(0, 0, 0, 0) : 'noDate';
          let mappedPlans = dateIngredientMap.get(key);
          if (!mappedPlans) {
            dateIngredientMap.set(key, [plan]);
          } else {
            mappedPlans.push(plan);
          }
        }
      });
      forceUpdate();
    }
    // eslint-disable-next-line
  }, [plans]);

  const checkOrUncheck = (ingredient, planId) => {
    console.log('checking', ingredient);
    ingredient.checked = !ingredient.checked;
    checkOrUncheckIngredient(planId, ingredient, fetchAndUpdatePlans); // todo when will the crossed out ingredients be removed from the list?
  }

  const getIngredientListItems = (plan, indented = false) => {
    return plan.missingIngredients.map((ingredient, index) => (
      <ListItem dense key={index} onClick={() => {checkOrUncheck(ingredient, plan._id)}}>
        <ListItemText className={classes.listItemText}
                      style={{ paddingLeft: indented ? '2rem' : '1rem', textDecoration: ingredient.checked ? 'line-through' : 'none', }}
                      primary={ingredient.name}
                      primaryTypographyProps={{ className: classes.listItemTextTypography }} />
      </ListItem>
    ))
  }

  const getListItems = () => {
    const listItems = [];
    dateIngredientMap.forEach((plans, date) => {
      console.log(date, plans);
      listItems.push(
        <>
          <ListSubheader component="div">
            <span className={classes.secondary}>{date === 'noDate' ? t('Without Date') : new Date(date).toLocaleDateString(t('dateLocale'), dateStringOptions)}</span>
            {plans.length === 1 ? <>{' - '}<span className={classes.primary}>{plans[0].title}</span></> : ''}
          </ListSubheader>
          {plans.length === 1 ? getIngredientListItems(plans[0])
            : plans.map((plan) =>
              <>
                <ListSubheader className={classes.indentedSubheader} component="div">
                  {plan.title}
                </ListSubheader>
                {getIngredientListItems(plan, true)}
              </>
            )
          }
        </>
      )
    });
    return listItems;
  }

  return (
    <List>
      <ListItem key='shoppingListHeading'>
        <span className={classes.listHeading}>{t('Missing Ingredients')}</span>
        <ListItemSecondaryAction onClick={onClose}>
          <Close />
        </ListItemSecondaryAction>
      </ListItem>
      {!plans ? <Typography className={classes.infoText}>{t('Loading') + '...'}</Typography>
        : (dateIngredientMap.size === 0) ? <Typography className={classes.infoText}>{t("List is currently empty")}</Typography>
          : getListItems()
      }
    </List>
  );
}

ShoppingList.propTypes = {
  /** user whose plans will be compiled into the shopping list */
  userId: string.isRequired,
  /** function that closes the ShoppingList component */
  onClose: func.isRequired,
  /** optional plans array. If not provided, plans will be fetched from database */
  plans: array,
}

ShoppingList.defaultProps = {
  plans: null,
}

export default ShoppingList;
