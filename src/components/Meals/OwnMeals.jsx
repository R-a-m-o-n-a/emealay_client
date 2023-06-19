import React from 'react';
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import Meals from "./Meals";
import AddButton from "../Buttons/AddButton";
import { useNavigate } from "react-router-dom";
import { withLoginRequired } from "../util";

/** Page that displays a user's own meals and adds a Navbar to the Meals list that allows adding a meal */
const OwnMeals = () => {
  const { t } = useTranslation();
  const { user } = useAuth0();

  let navigate = useNavigate();
  const goToAddMeal = () => {navigate('add');};

  return (
    <>
      <Navbar pageTitle={t('Meals')} rightSideComponent={<AddButton onClick={goToAddMeal} />} />
      <Meals own userId={user.sub} />
    </>
  );
}

export default withLoginRequired(OwnMeals);
