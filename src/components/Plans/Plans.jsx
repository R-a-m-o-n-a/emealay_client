import React, { useEffect, useState } from 'react';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { ExpandLess, History, VisibilityOff } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faShoppingBasket, faTimes } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from "@material-ui/styles";
import EditPlanItem from "./EditPlanItem";
import { useTranslation } from "react-i18next";
import MealDetailView from "../Meals/MealDetailView";
import { bool, string } from "prop-types";
import { dateStringOptions, withLoginRequired } from "../util";
import MissingIngredients from "./MissingIngredients";
import { getPlansOfUser } from "./plans.util";
import ShoppingList from "./ShoppingList";
import MealAvatar from "../Meals/MealAvatar";

const useStyles = makeStyles((theme) => ({
  plansTable: {
    maxHeight: `calc(100% - ${process.env.REACT_APP_NAV_BOTTOM_HEIGHT}px)`,
  },
  pastPlanRow: {
    color: theme.palette.text.disabled,
  },
  goToPastPlansRow: {
    padding: '5px',
    textAlign: "center",
    lineHeight: '90%',
  },
  thCell: {
    fontSize: '1rem',
  },
  tableCell: {
    padding: '12px 16px',
    fontSize: '1rem',
    color: "inherit",
  },
  narrowCell: {
    padding: '12px 0 !important',
  },
  green: {
    color: theme.palette.primary[theme.palette.type],
  },
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem",
    fontFamily: "Cookie",
    fontSize: "1.5rem",
    lineHeight: "1.6rem",
  },
}));

/** content of page that displays all plans of a given user (not including Navbar) */
const Plans = (props) => {
  const classes = useStyles();

  const { t } = useTranslation();

  const { own, userId } = props;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [missingIngredientsDialogOpen, setMissingIngredientsDialogOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState(null);
  const [emptyListFound, setEmptyListFound] = useState(false);

  const [pastPlansOpen, setPastPlansOpen] = useState(false);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [mealBeingViewed, setMealBeingViewed] = useState(null);

  const fetchAndUpdatePlans = () => {
    getPlansOfUser(userId, plansFound => {
      setPlans(plansFound);
      console.log(plansFound);
      if (plansFound.length === 0) setEmptyListFound(true);
      if (itemBeingEdited) {
        setItemBeingEdited(plansFound.find(p => p._id === itemBeingEdited._id)); // update itemBeingEdited
      }
    });
  }

  // eslint-disable-next-line
  useEffect(fetchAndUpdatePlans, [userId]);

  const openMealDetailView = (meal) => {
    setMealBeingViewed(meal);
    setDetailViewOpen(true);
  };

  const openEditItemDialog = (planItem) => {
    if (own) {
      setItemBeingEdited(planItem);
      console.log(itemBeingEdited, planItem, itemBeingEdited === planItem)
      setEditDialogOpen(true);
    }
  }

  function openMissingIngredientDialog(planItem) {
    if (own && planItem.missingIngredients.length > 0) {
      setItemBeingEdited(planItem);
      setMissingIngredientsDialogOpen(true);
    }
  }

  const toggleHistory = (event) => {
    setPastPlansOpen(prevState => {
      // this scrolling mechanism is probably not the best possible behaviour to show the history of plans
      if (prevState === false) { // open history
        setTimeout(() => {event.target.scrollIntoView({ behavior: "smooth", block: "center" });}, 300);
      } else { // close history
        setTimeout(() => {event.target.scrollIntoView({ behavior: "smooth", block: "end" });}, 300);
      }
      return !prevState;
    });
  }

  const getPlanRows = () => {
    let pastPlansDone = false;
    const pastPlans = [];
    const futurePlans = [];
    plans.forEach((plan, index) => {
      const planIsInPast = new Date(plan.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
      if (!plan.hasDate || (plan.hasDate && !(planIsInPast))) {
        pastPlansDone = true;
      }
      const currentRow = (
        <TableRow key={plan._id + index} className={pastPlansDone ? '' : classes.pastPlanRow}>
          <TableCell className={classes.tableCell}>
            {plan.connectedMeal ?
              <Grid container spacing={1} justify="space-between" alignItems="center">
                <Grid item xs={9} onClick={() => {openEditItemDialog(plan);}}>{plan.title}</Grid>
                <Grid item xs={3} onClick={() => {openMealDetailView(plan.connectedMeal);}}><MealAvatar meal={plan.connectedMeal} /></Grid>
              </Grid>
              : <Box onClick={() => {openEditItemDialog(plan);}}>{plan.title}</Box>
            }
          </TableCell>
          <TableCell onClick={() => {openEditItemDialog(plan);}} align="center" className={classes.tableCell + ' ' + classes.narrowCell}>
            {(plan.hasDate && plan.date) ? new Date(plan.date).toLocaleDateString(t('dateLocale'), dateStringOptions) : ''}
          </TableCell>
          <TableCell className={classes.tableCell}
                     align="center"
                     onClick={() => {plan.missingIngredients.length === 0 ? openEditItemDialog(plan) : openMissingIngredientDialog(plan);}}>
            <FontAwesomeIcon icon={plan.gotEverything ? faCheck : faTimes} />
          </TableCell>
        </TableRow>
      );
      if (!pastPlansDone) {
        pastPlans.push(currentRow);
      } else {
        futurePlans.push(currentRow);
      }
    });

    const rows = [];
    if (pastPlans.length > 0) {
      rows.push(
        <TableBody key='pastPlansTableBody' style={{ display: pastPlansOpen ? 'table-row-group' : 'none' }}>
          {pastPlans}
        </TableBody>
      );
      rows.push(
        <TableBody key='historyButtonTableBody'>
          <TableRow key={'openOrClosePlanHistoryButton'}>
            <TableCell colSpan={3} className={classes.goToPastPlansRow} onClick={toggleHistory}>
              {pastPlansOpen ? <VisibilityOff color="disabled" /> : <><ExpandLess /><History /><ExpandLess /></>}
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
    rows.push(<TableBody key='futurePlansTableBody'>{futurePlans}</TableBody>);
    return rows;
  }

  const planList = (
    <>
      {plans.length === 0 ? <Typography className={classes.infoText}>{emptyListFound ? t("Currently nothing planned") : t('Loading') + '...'} </Typography> :
        <TableContainer className={classes.plansTable}>
          <Table aria-label="table of all plans" stickyHeader>
            <TableHead>
              <TableRow key='planListHeader'>
                <TableCell className={classes.thCell}>{t('Plan')}</TableCell>
                <TableCell align="center" className={classes.narrowCell + ' ' + classes.thCell}>{t('Due Date')}</TableCell>
                <TableCell align="center" className={classes.thCell} onClick={() => {setShoppingListOpen(true)}}>
                <span className="fa-layers fa-fw">
                  <FontAwesomeIcon icon={faShoppingBasket} transform="grow-6" />
                  <FontAwesomeIcon icon={faCheck} className={classes.green} transform="down-2" />
                </span>
                </TableCell>
              </TableRow>
            </TableHead>
            {getPlanRows()}
          </Table>
        </TableContainer>
      }

      <MissingIngredients planItem={itemBeingEdited} closeDialog={() => {
        setItemBeingEdited(null);
        setMissingIngredientsDialogOpen(false);
      }} onDoneEditing={fetchAndUpdatePlans} open={missingIngredientsDialogOpen} />

      <EditPlanItem open={editDialogOpen} planItem={itemBeingEdited} closeDialog={() => {
        setItemBeingEdited(null);
        setEditDialogOpen(false);
      }} onDoneEditing={fetchAndUpdatePlans} />

      <MealDetailView open={detailViewOpen} meal={mealBeingViewed} allowEditing={own} closeDialog={() => {
        setMealBeingViewed(null);
        setDetailViewOpen(false);
      }} />
    </>
  );

  const shoppingList = <ShoppingList userId={userId} plans={plans} onClose={() => {
    setShoppingListOpen(false);
    fetchAndUpdatePlans();
  }} />;

  return shoppingListOpen ? shoppingList : planList;
}

Plans.propTypes = {
  /** are these the user's own plans or is another user watching foreign plans? In the latter case editing will be prohibited. */
  own: bool.isRequired,
  /** userId of user whose plans are to be displayed */
  userId: string.isRequired,
}

export default withLoginRequired(Plans);
