import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NavTabs from "./NavTabs";
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import { func } from "prop-types";
import Snackbars from "./util/Snackbars";
import { LoadingBody } from "./Loading";

// route-based lazy loading of components according to https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting and https://react.dev/reference/react/lazy#load
const Home = lazy(() => import('./Home'));

const AddMeal = lazy(() => import('./Meals/AddMeal'));
const EditMeal = lazy(() => import('./Meals/EditMeal'));
const OwnMeals = lazy(() => import('./Meals/OwnMeals'));
const MealDetailView = lazy(() => import('./Meals/MealDetailView'));

const AddPlanItem = lazy(() => import('./Plans/AddPlanItem'));
const EditPlanItem = lazy(() => import('./Plans/EditPlanItem'));
const OwnPlans = lazy(() => import('./Plans/OwnPlans'));
const ShoppingList = lazy(() => import('./Plans/ShoppingList'));

const Social = lazy(() => import('./Social/Social'));
const ContactsContent = lazy(() => import('./Social/ContactsContent'));

const Settings = lazy(() => import('./Settings/Settings'));
const AdvancedSettings = lazy(() => import('./Settings/AdvancedSettings'));
const EditProfile = lazy(() => import('./Settings/EditProfile'));


const useStyles = makeStyles(theme => ({
  content: {
    height: `calc(100% - ${process.env.REACT_APP_NAV_BOTTOM_HEIGHT}px)`,
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
  },
}));

/**
 * Wrapper component to display content page and bottom navigation
 * @component
 */
const ContentWrapper = (props) => {
  const classes = useStyles();
  let navigate = useNavigate();
  let { state } = useLocation();

  const [deletedItem, setDeletedItem] = useState(null);
  const [deletedItemCategory, setDeletedItemCategory] = useState(null);

  useEffect(() => {
    if (state) {
      if (state.snackbar) {
        const { snackbar: { category, deletedItem } } = state;
        setDeletedItemCategory(category);
        setDeletedItem(deletedItem);
      }
    }
  }, [state]);

  const goToPlans = () => {navigate('plans');};

  return (
    <>
      <Box className={classes.content}>
        <Suspense fallback={<LoadingBody />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="meals">
            <Route index element={<OwnMeals />} />
            <Route path="add" element={<AddMeal />} />
            <Route path={'detail/:mealId'} element={<MealDetailView />} />
            <Route path={'edit/:mealId'} element={<EditMeal />} />
          </Route>
          <Route path="plans">
            <Route index element={<OwnPlans />} />
            <Route path="add" element={<AddPlanItem onDoneAdding={goToPlans} />} />
            <Route path="edit/:planItemId" element={<EditPlanItem />} />
            <Route path="shoppingList/:userId" element={<ShoppingList />} />
          </Route>
          <Route path="social">
            <Route index element={<Social />} />
            <Route path="contact/:userId/:tab" element={<ContactsContent />} />
          </Route>
          <Route path="settings">
            <Route index element={<Settings />} />
            <Route path="editProfile" element={<EditProfile />} />
            <Route path="advanced" element={<AdvancedSettings setDarkModeInAppLevel={props.setDarkMode} />} />
          </Route>
        </Routes>
        <Snackbars category={deletedItemCategory} deletedItem={deletedItem} />
        </Suspense>
      </Box>
      <NavTabs />
    </>
  );
}

ContentWrapper.propTypes = {
  /** needs to receive a function that can toggle dark mode directly from the App.jsx component to pass to component that has dark mode settings */
  setDarkMode: func.isRequired,
}

export default ContentWrapper;

