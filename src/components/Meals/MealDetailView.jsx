import React, { useEffect, useState } from 'react';
import { Box, Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { arrayOf, bool, func, shape, string } from "prop-types";
import EditMeal from "./EditMeal";
import Navbar from "../Navbar";
import BackButton from "../Buttons/BackButton";
import ImageGrid from "../Images/ImageGrid";
import { useTranslation } from "react-i18next";
import EditButton from "../Buttons/EditButton";
import FullScreenDialog from "../util/FullScreenDialog";
import { fetchAndUpdateMeal } from "./meals.util";
import ShareButton from "../util/ShareButton";
import { useAuth0 } from "@auth0/auth0-react";
import MealImportButton from "./MealImportButton";
import { useHistory, useRouteMatch } from "react-router-dom";

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
  shareButton: {
    textAlign: "right",
  },
}));

/** Dialog page that displays Meal Details and optionally opens Edit Dialog */
const MealDetailView = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth0();
  let { path } = useRouteMatch();
  let history = useHistory();

  const { meal: initialMeal, open, closeDialog, allowEditing } = props;

  const [own, setOwn] = useState(false);
  const [meal, setMeal] = useState(initialMeal);
  // const [/*mealUser*/, setMealUser] = useState(null);

  /*  useEffect(() => {
      if (meal) {
        getUserById(meal.userId, setMealUser);
      }
    }, [meal]);*/

  useEffect(() => {
    if (user && meal) {
      setOwn(user.sub === meal.userId);
    } else {
      setOwn(false);
    }
  }, [user, meal]);

  useEffect(() => {
    setMeal(initialMeal);
  }, [initialMeal]);

  const fetchMeal = () => {
    if (meal && meal._id) {
      fetchAndUpdateMeal(meal._id, setMeal);
    }
  }

  const openEditItemDialog = () => {
    if (allowEditing) {
      history.push('/meals/edit/' + meal._id);
    }
  }

  const closeEditItemDialog = () => {
    history.goBack();
  }

  const rightSideComponent = () => {
    if (isAuthenticated) {
      if (own) {
        if (allowEditing) return <EditButton onClick={() => {openEditItemDialog(meal)}} />;
      } else {
        return <MealImportButton meal={meal} />;
      }
    }
    return null;
  }

  return (
    <>
      {meal ?
        <FullScreenDialog open={open} onClose={closeDialog}>
          <Navbar pageTitle={t('Meal')} rightSideComponent={rightSideComponent} leftSideComponent={isAuthenticated && <BackButton onClick={closeDialog} />} />
          <Box className={classes.content}>
            <Grid container spacing={0} justify="space-between" alignItems="flex-start" wrap="nowrap">
              <Grid item xs className={classes.mealTitle}>
                <Typography variant="h4">{meal.title}</Typography>
              </Grid>
              <Grid item xs className={classes.shareButton}>
                <ShareButton link={window.location.origin + '/meals/view/' + meal._id} title={meal.title} text={t('Check out the following meal: {{mealTitle}}', meal.title)} />
              </Grid>
            </Grid>
            {meal.recipeLink ? <Typography><Link href={meal.recipeLink} target="_blank">{meal.recipeLink}</Link></Typography> : ''}
            {meal.comment ? <Typography className={classes.comment}>{meal.comment}</Typography> : ''}
            {meal.images && meal.images.length > 0 ? <ImageGrid images={meal.images} allowChoosingMain={false} /> : ''}
          </Box>
        </FullScreenDialog>
        : ''}

      {isAuthenticated && <EditMeal open={allowEditing && own && path.includes('edit')} meal={meal} closeDialog={closeEditItemDialog} onDoneEditing={fetchMeal} onDoneDelete={() => {
        fetchMeal();
        closeEditItemDialog();
        closeDialog();
      }} />}
    </>
  );
}

MealDetailView.propTypes = {
  /** meal to be viewed */
  meal: shape({
    _id: string,
    title: string,
    images: arrayOf(shape({
      name: string,
      url: string,
    })),
    recipeLink: string,
    comment: string,
    category: string,
    tags: arrayOf(string),
  }),
  /** is component visible? */
  open: bool,
  /** function that sets open to false */
  closeDialog: func.isRequired,
  /** allow opening edit page? (To be false if not one's own meal) */
  allowEditing: bool,
}

MealDetailView.defaultProps = {
  meal: null,
  open: true,
  allowEditing: false,
}

export default MealDetailView;

