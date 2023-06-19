import React, { useEffect, useState } from 'react';
import { Button, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { any, string } from "prop-types";
import Alert from "@material-ui/lab/Alert";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { useTranslation } from "react-i18next";
import { deleteAllImagesFromMeal } from "../Meals/meals.util";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { addPlan } from "../Plans/plans.util";

const useStyles = makeStyles((theme) => ({
  snackbarOffset: {
    bottom: parseInt(process.env.REACT_APP_NAV_BOTTOM_HEIGHT) + 10 + 'px',
  },
  deleteSnackbar: {
    backgroundColor: theme.palette.error[theme.palette.type],
    width: '100%',
  },
  readdSnackbar: {
    backgroundColor: theme.palette.primary[theme.palette.type],
  },
}));

const serverURL = process.env.REACT_APP_SERVER_URL;
/**
 *
 */
const Snackbars = (props) => {
  const classes = useStyles(props);
  const { category, deletedItem } = props;
  const { t } = useTranslation();
  let navigate = useNavigate();
  const { state } = useLocation();

  const [deleteMessageVisible, setDeleteMessageVisible] = useState(false);
  const [readdedMessageVisible, setReaddedMessageVisible] = useState(false);

  const [deleteImagesTimeout, setDeleteImagesTimeout] = useState(0);

  const showDeletedItemMessage = () => {
    setDeleteMessageVisible(true);
    // if a meal is deleted, wait 10 seconds and then delete the images in the background (so that they are not gone in case the meal gets readded within the timer
    if (category === 'Meal') {
      if (deletedItem.images && deletedItem.images.length > 0) {
        setDeleteImagesTimeout(setTimeout(() => {
          deleteAllImagesFromMeal(deletedItem._id);
        }, 10000));
      }
    }
    navigate(window.location, { replace: true, state: null });
  }

  const showReaddedItemMessage = () => {
    setDeleteMessageVisible(false);
    setReaddedMessageVisible(true);
  }

  const undoDeletion = () => {
    if (category === 'Meal') {
      clearTimeout(deleteImagesTimeout);
      setDeleteImagesTimeout(0);
      axios.post(serverURL + '/meals/add', deletedItem).then((result) => {
        console.log('re-add request sent', result.data);
        showReaddedItemMessage();
        // refresh meal list
        navigate(window.location, { replace: true, state: { ...state, refresh: true } });
      });
    } else if (category === 'Plan') {
      addPlan(deletedItem, () => {
        showReaddedItemMessage();
        // refresh plans
        navigate(window.location, { replace: true, state: { ...state, refresh: true } });
      });
    }
  }

  useEffect(() => {
    if (category && deletedItem) {
      // show snackbar
      showDeletedItemMessage();
    }
  }, [category, deletedItem]); // eslint-disable-line react-hooks/exhaustive-deps

  /* the ClickAwayListenerProp in Snackbar prevents the snackbar from closing if the user clicks away
   * so now the Snackbar stays open even if the user opens another page. Not sure which is better. */
  return (
    <>
      <Snackbar open={deleteMessageVisible} autoHideDuration={5000} ClickAwayListenerProps={{ onClickAway: () => {} }} onClose={() => {setDeleteMessageVisible(false); }} className={classes.snackbarOffset}>
        <Alert action={<Button color="inherit" size="small" onClick={undoDeletion}>{t('Undo')}</Button>}
               icon={<CircularProgressWithLabel initialValue={5} />}
               variant="filled"
               className={classes.deleteSnackbar}>
          {deletedItem ? t(`${category} {{title}} deleted`, { title: deletedItem.title }) : t(`${category} deleted`)}
        </Alert>
      </Snackbar>

      <Snackbar open={readdedMessageVisible}
                autoHideDuration={2000}
                onClose={() => {setReaddedMessageVisible(false); }}
                message={deletedItem ? t(`${category} {{title}} re-added`, { title: deletedItem.title }) : t(`${category} re-added`)}
                className={classes.snackbarOffset}
                ClickAwayListenerProps={{ onClickAway: () => null }}
                ContentProps={{ className: classes.readdSnackbar }} />
    </>
  )
    ;
}

Snackbars.propTypes = {
  /** name of category to be displayed, e.g., 'Plan' or 'Meal' (capitalized) */
  category: string,
  /** item that was deleted */
  deletedItem: any,
};

Snackbars.defaultProps = {
  deletedItem: null,
  category: null,
};

export default Snackbars;

