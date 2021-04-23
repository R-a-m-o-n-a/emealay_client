import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import MealDetailView from "./MealDetailView";
import { fetchAndUpdateMeal } from "./meals.util";

/** Dialog page that displays Meal Details and optionally opens Edit Dialog */
const MealDetailViewExtern = (props) => {
  const { user } = useAuth0();
  const history = useHistory();
  const { mealId } = useParams();

  const [meal, setMeal] = useState(null);
  const [own, setOwn] = useState(false);

  useEffect(() => {
    console.log('fetching');
    fetchAndUpdateMeal(mealId, (meal) => {
      setMeal(meal);
      if (user) {
        setOwn(user.sub === meal.userId);
      }
      console.log('get meal', meal);
    });
  }, [mealId, user]);

  return <MealDetailView meal={meal} allowEditing={own} closeDialog={() => {history.goBack();}} />;
}

export default MealDetailViewExtern;
