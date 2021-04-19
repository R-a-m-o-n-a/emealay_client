import React from 'react';
import { func } from "prop-types";
import { Check } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  doneButton: {
    fontSize: '2rem',
    color: theme.palette.background.default,
    padding: 0,
  }
}));

/** Button in form of a checkmark */
const DoneButton = (props) => {
  const classes = useStyles();
  const { onClick } = props;

  return (
    <IconButton onClick={onClick}><Check className={classes.doneButton} /></IconButton>
  );
}

DoneButton.propTypes = {
  onClick: func.isRequired,
};

export default DoneButton;
