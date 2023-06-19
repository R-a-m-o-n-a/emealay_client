import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Plans from "./Plans";
import { withLoginRequired } from "../util";
import AddButton from "../Buttons/AddButton";
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/** Page that displays a user's own plans. (A simple wrapper that sets the props for the Plans component) */
const OwnPlans = () => {
  const { t } = useTranslation();
  const { user } = useAuth0();

  let navigate = useNavigate();
  const goToAddMeal = () => {navigate('add');};

  return (
    <>
      <Navbar pageTitle={t('Plans')} rightSideComponent={<AddButton onClick={goToAddMeal} />} />
      <Plans own userId={user.sub} />
    </>
  );
}

export default withLoginRequired(OwnPlans);
