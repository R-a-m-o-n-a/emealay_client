import { Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";
import OwnMeals from "./OwnMeals";
import MealDetailViewExtern from "./MealDetailViewExtern";
import { useAuth0 } from "@auth0/auth0-react";

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
