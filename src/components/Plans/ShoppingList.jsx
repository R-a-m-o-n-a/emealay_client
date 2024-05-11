import { alpha, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { checkOrUncheckIngredient, getPlansOfUser } from "./plans.util";
import { makeStyles } from "@material-ui/styles";
import { dateStringOptions } from "../util";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import AddButton from "../Buttons/AddButton";
import { useTracking } from "react-tracking";

const useStyles = makeStyles((theme) => ({
  listHeading: {
    fontFamily: "Neucha",
    fontSize: "1.4rem",
    lineHeight: "1.5rem",
    textDecoration: "underline",
  },
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem",
    fontFamily: "Neucha",
    fontSize: "1.3rem",
    lineHeight: "1.4rem",
  },
  listItemTextTypography: {
    fontSize: '1rem',
  },
  subheader: {
    lineHeight: '2.5rem',
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  },
  indentedSubheader: {
    paddingLeft: '2rem',
    lineHeight: '2rem',
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  primary: {
    color: theme.palette.primary.main,
  },
  secondary: {
    color: theme.palette.secondary.main,
  },
  closeIcon: {
    marginRight: '3px',
    fontSize: '1.7rem',
  }
}));

// todo: Should crossed off ingredients be eliminated from the list? (they do after date is expired, right?)
//  If yes, when/what action will trigger this? If yes, may need to add a field to missingIngredients database model
/** Displays a list of all ingredients of future plans (ingredients of past plans will not be displayed)
 * + checked ingredients will be displayed with a line through the text
 * + allows checking off and unchecking items from the list by clicking on them
 * + orders ingredients by date and meal */
const ShoppingList = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { userId } = params;
  const { trackEvent } = useTracking({ subpage: 'shoppingList' }, { dispatchOnMount: true });

  const [plans, setPlans] = useState([]);

  const fetchAndUpdatePlans = () => {
    getPlansOfUser(userId, setPlans);
  }

  // set the plans that are given in state as a temporary option while the ones from the server is loaded
  useEffect(() => {
    if (!plans || !(plans.length > 0)) {
      if (state && state.plans) setPlans(state.plans);
    }
    fetchAndUpdatePlans();
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const dateIngredientMap = useMemo(() => {

    const dateIngMap = new Map();
    plans.forEach((plan) => {
      const planIsInPast = plan.hasDate && new Date(plan.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
      if (!planIsInPast && plan.missingIngredients && plan.missingIngredients.length > 0) {
        const key = plan.hasDate && plan.date ? new Date(plan.date).setHours(0, 0, 0, 0) : 'noDate';
        let mappedPlans = dateIngMap.get(key);
        if (!mappedPlans) {
          dateIngMap.set(key, [plan]);
        } else {
          mappedPlans.push(plan);
        }
      }
    });
    return dateIngMap;
  }, [plans]);

  const checkOrUncheck = (ingredient, planId) => {
    ingredient.checked = !ingredient.checked;
    trackEvent({ event: (ingredient.checked ? 'checking' : 'unchecking') + '-ingredient', ingredient: ingredient.name, planId });
    checkOrUncheckIngredient(planId, ingredient, fetchAndUpdatePlans);
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
      listItems.push(
        <>
          <ListSubheader key={date} className={classes.subheader} component="div">
            <span className={classes.secondary}>{date === 'noDate' ? t('Without Date') : new Date(date).toLocaleDateString(t('DATE_LOCALE'), dateStringOptions)}</span>
            {plans.length === 1 ? <>{' - '}<span className={classes.primary}>{plans[0].title}</span></> : ''}
          </ListSubheader>
          {plans.length === 1 ? getIngredientListItems(plans[0])
            : plans.map((plan) =>
              <>
                <ListSubheader key={plan._id} className={classes.indentedSubheader} component="div">
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

  const goToAddMeal = () => {navigate('add');};
  const goBack = () => {navigate(-1);};

  // if there is no way to get the shopping list (either from state or from userId, redirect to plans
  if (!(state && state.plans) && !(params && params.userId)) return <Navigate to="/plans/" replace />;

  return (
    <>
      <Navbar pageTitle={t('Plans')} rightSideComponent={<AddButton onClick={goToAddMeal} />} />
      <List>
        <ListItem key='shoppingListHeading'>
          <span className={classes.listHeading}>{t('Missing Ingredients')}</span>
          <ListItemSecondaryAction onClick={goBack}>
            <Close className={classes.closeIcon} />
          </ListItemSecondaryAction>
        </ListItem>
        {!plans ? <Typography className={classes.infoText}>{t('Loading') + '...'}</Typography>
          : (dateIngredientMap.size === 0) ? <Typography className={classes.infoText}>{t("List is currently empty")}</Typography>
            : getListItems()
        }
      </List>
    </>
  );
}

export default ShoppingList;
