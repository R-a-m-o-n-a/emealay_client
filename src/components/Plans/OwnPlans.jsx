import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Plans from "./Plans";
import { withLoginRequired } from "../util";

/** Page that displays a user's own plans. (A simple wrapper that sets the props for the Plans component) */
const OwnPlans = () => {
  const { user } = useAuth0();

  return <Plans own userId={user.sub} />;
}

export default withLoginRequired(OwnPlans);
