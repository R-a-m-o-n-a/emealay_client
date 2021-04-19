import React from 'react';
import { func } from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Close } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  navButton: {
    color: theme.palette.background.default,
    padding: 0,
  }
}));

/** Button in form of a big white X icon */
function SimpleCloseX(props) {
  const classes = useStyles();

  const { onClick } = props;

  return (
    <IconButton className={classes.navButton} onClick={onClick}><Close fontSize="large" /></IconButton>
  );
}

SimpleCloseX.propTypes = {
  onClick: func.isRequired,
};

export default SimpleCloseX;
