import React, { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from "react-router-dom";
import NavTabs from "./NavTabs";
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import Snackbars from "./util/Snackbars";
import { LoadingBody } from "./Loading";

const useStyles = makeStyles(theme => ({
  content: {
    height: `calc(100% - ${process.env.REACT_APP_NAV_BOTTOM_HEIGHT}px)`,
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
  },
}));

/**
 * Wrapper component to display content page and bottom navigation
 * @component
 */
const ContentWrapper = (props) => {
  const classes = useStyles();
  let { state } = useLocation();

  const [deletedItem, setDeletedItem] = useState(null);
  const [deletedItemCategory, setDeletedItemCategory] = useState(null);

  useEffect(() => {
    if (state) {
      if (state.snackbar) {
        const { snackbar: { category, deletedItem } } = state;
        setDeletedItemCategory(category);
        setDeletedItem(deletedItem);
      }
    }
  }, [state]);

  return (
    <>
      <Box className={classes.content}>
        <Suspense fallback={<LoadingBody />}>
        <Outlet />
        <Snackbars category={deletedItemCategory} deletedItem={deletedItem} />
        </Suspense>
      </Box>
      <NavTabs />
    </>
  );
}

export default ContentWrapper;

