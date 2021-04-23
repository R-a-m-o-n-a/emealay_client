import { Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";
import OwnPlans from "./OwnPlans";

const PlanWrapper = () => {

  let { path } = useRouteMatch();

  return (
    <>
      <Switch>
        <Route exact path={path}>
          <OwnPlans />
        </Route>
        <Route path={`${path}/edit/:planId`}>
          <OwnPlans />
        </Route>
      </Switch>
    </>
  );
}

export default PlanWrapper;
