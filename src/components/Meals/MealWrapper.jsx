import { Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";
import OwnMeals from "./OwnMeals";
import MealDetailViewExtern from "./MealDetailViewExtern";
import { useAuth0 } from "@auth0/auth0-react";

/** Wrapper component for Meals. Makes sure that Meals component receives the complete routing path to render the correct view.
 *
 * Might become obsolete in a future version if routing is properly handled by Meals */
const MealWrapper = () => {

  let { path } = useRouteMatch();
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <Switch>
        <Route exact path={path}>
          <OwnMeals />
        </Route>
        <Route path={`${path}/view/:mealId`}>
          <MealDetailViewExtern />
        </Route>
        <Route path={`${path}/detail/:mealId`}>
          {isAuthenticated ? <OwnMeals /> : <MealDetailViewExtern />}
        </Route>
        <Route path={`${path}/edit/:mealId`}>
          {isAuthenticated ? <OwnMeals /> : <MealDetailViewExtern />}
        </Route>
      </Switch>
    </>
  );
}

export default MealWrapper;
