import { SlidingTransitionLeft } from "./SlidingTransition";
import { Dialog } from "@material-ui/core";
import React from "react";
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  fullScreenDialog: {
    backgroundColor: theme.palette.background.default,
  }
}));
const FullScreenDialog = (props) => {
  const classes = useStyles();

  return (
    <Dialog {...props} fullScreen classes={{paper: classes.fullScreenDialog}} TransitionComponent={SlidingTransitionLeft}>
      {props.children}
    </Dialog>
  )
}

export default FullScreenDialog;
