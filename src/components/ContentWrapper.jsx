import React from 'react';
import { useHistory } from "react-router-dom";
import NavTabs from "./NavTabs";
import Social from "./Social/Social";
import Settings from "./Settings/Settings";
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import AddPlanItem from "./Plans/AddPlanItem";
import AddMeal from "./Meals/AddMeal";
import Home from "./Home";
import OwnMeals from "./Meals/OwnMeals";
import OwnPlans from "./Plans/OwnPlans";

const useStyles = makeStyles(theme => ({
  content: {
    height: `calc(100% - ${process.env.REACT_APP_NAV_BOTTOM_HEIGHT}px)`,
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
  },
}));

/**
 * Wrapper component to display content page and bottom navigation
 * @param activeTab {string} the site to display, must be present in the components switch case
 * @component
 */
const ContentWrapper = (props) => {
  const classes = useStyles();
  const { activeTab } = props;
  let history = useHistory();

  const goToPlans = () => {history.push('/plans');};
  const goToMeals = () => {history.push('/meals');};

  let contentPage;
  switch (activeTab) {
    case "meals":
      contentPage = <OwnMeals />;
      break;
    case "social":
      contentPage = <Social />;
      break;
    case "settings":
      contentPage = <Settings setDarkModeInAppLevel={props.setDarkMode} />;
      break;
    case "plans/add":
      contentPage = <AddPlanItem onDoneAdding={goToPlans} />;
      break;
    case "meals/add":
      contentPage = <AddMeal onDoneAdding={goToMeals} />;
      break;
    case "plans":
      contentPage = <OwnPlans />;
      break;
    case "home":
    default:
      contentPage = <Home />;
  }

  return (
    <>
      <Box className={classes.content}>
        {contentPage}
      </Box>
      <NavTabs />
    </>
  );
}

export default ContentWrapper;

