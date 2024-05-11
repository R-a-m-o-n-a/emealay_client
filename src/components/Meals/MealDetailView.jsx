import React, { useEffect, useState } from 'react';
import { Box, Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Navbar from "../Navbar";
import BackButton from "../Buttons/BackButton";
import ImageGrid from "../Images/ImageGrid";
import { useTranslation } from "react-i18next";
import EditButton from "../Buttons/EditButton";
import { fetchAndUpdateMeal } from "./meals.util";
import ShareButton from "../util/ShareButton";
import { useAuth0 } from "@auth0/auth0-react";
import MealImportButton from "./MealImportButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PlanMealButton from "../util/PlanMealButton";
import { getUserById } from "../Settings/settings.util";

import { useTracking } from "react-tracking";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: '1em',
    maxHeight: `calc(100% - ${process.env.REACT_APP_NAV_TOP_HEIGHT}px)`,
    overflowY: 'auto',
    backgroundColor: theme.palette.background.default,
  },
  mealTitle: {
    flexGrow: 10,
  },
  comment: {
    margin: '0.5rem 0',
    whiteSpace: "pre-wrap",
  },
}));

/** todo updated description */
const MealDetailView = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth0();
  let { state, pathname } = useLocation();
  let navigate = useNavigate();
  let { mealId } = useParams();

  const [own, setOwn] = useState(undefined);
  const [meal, setMeal] = useState();
  const [nameOfOtherUser, setNameOfOtherUser] = useState(null);
  const { Track } = useTracking({
    page: (own ?? user?.sub === meal?.userId) ? 'view-own-meal' : 'view-meal',
    mealId,
    ...(own === false && { mealOwnerId: meal?.userId }) // add conditional property userId of meal owner if not own meal
  }, { dispatchOnMount: !(state?.haveSentPageEventTracker === true) });
  useEffect(() => { // when page is first opened, set the state to make sure page-open event is only tracked once (and not again when coming back from edit for example
    if (!(state?.haveSentPageEventTracker === true)) navigate(pathname, { replace: true, state: { ...state, haveSentPageEventTracker: true } })
  }, []); // eslint-disable-line

  useEffect(() => {
    if (user && meal) {
      const own = user.sub === meal.userId;
      setOwn(own);
      if (!own && meal.userId) { // meal is loaded but it is other user's meal -> load other user's name for NavBar title
        getUserById(meal.userId, (user) => {
          setNameOfOtherUser(user && user.user_metadata && user.user_metadata.username ? user.user_metadata.username : user.given_name);
        });
      }
    }
  }, [user, meal]); // eslint-disable-line react-hooks/exhaustive-deps

  // set the meal that is given in state as a temporary option while the one from the server is loaded
  if (!meal && state && state.meal) setMeal(state.meal);

  useEffect(() => {
    fetchAndUpdateMeal(mealId, setMeal);
  }, [mealId]);

  const openEditItemDialog = () => {
    if (own) {
      navigate('../edit/' + meal._id, { state: { meal } });
    }
  }

  const goBack = () => {
    navigate(-1);
  }

  const rightSideComponent = () => {
    if (isAuthenticated) {
      if (own) {
        return <EditButton onClick={() => {openEditItemDialog(meal)}} />;
      } else {
        return <MealImportButton meal={meal} />;
      }
    }
    return null;
  }

  return (
    <Track>
      {meal ?
        <>
          <Navbar secondary={!own}
                  pageTitle={own || !nameOfOtherUser ? t('Meal') : t('Meal of {{name}}', { name: nameOfOtherUser })}
                  rightSideComponent={rightSideComponent()}
                  leftSideComponent={isAuthenticated && <BackButton onClick={goBack} />} />
          <Box className={classes.content}>
            <Grid container spacing={0} justifyContent="space-between" alignItems="flex-start" wrap="nowrap">
              <Grid item xs className={classes.mealTitle}>
                <Typography variant="h4">{meal.title}</Typography>
              </Grid>
              <Grid item xs>
                <ShareButton link={window.location.origin + '/meals/detail/' + meal._id} title={meal.title} text={t('Check out the following meal: {{mealTitle}}', meal.title)} />
              </Grid>
            </Grid>
            {meal.recipeLink ? <Typography><Link href={meal.recipeLink} target="_blank">{meal.recipeLink}</Link></Typography> : ''}
            {meal.comment ? <Typography className={classes.comment}>{meal.comment}</Typography> : ''}
            {meal.images && meal.images.length > 0 ? <ImageGrid images={meal.images} allowChoosingMain={false} /> : ''}
          </Box>

          {(own && !(state?.mealContext === 'plans')) && <PlanMealButton meal={meal} />}
        </>
        : ''}
    </Track>
  );
}

export default MealDetailView;

