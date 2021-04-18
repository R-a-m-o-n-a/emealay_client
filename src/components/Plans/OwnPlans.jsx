import React from 'react';
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import Plans from "./Plans";
import AddButton from "../Buttons/AddButton";
import { useHistory } from "react-router-dom";
import { withLoginRequired } from "../util";

/** Page that displays a user's own plans and adds a Navbar to the plans list that allows adding a plan */
const OwnPlans = () => {
  const { t } = useTranslation();
  const { user } = useAuth0();

  let history = useHistory();
  const goToAddPlan = () => {history.push('/plans/add');};

  return (
    <>
      <Navbar pageTitle={t('Plans')} rightSideComponent={<AddButton onClick={goToAddPlan} />} />

      <Plans own userId={user.sub} />
    </>
  );
}

export default withLoginRequired(OwnPlans);
