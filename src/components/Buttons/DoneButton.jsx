import React from 'react';
import { func } from "prop-types";
import { Check } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  doneButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '2rem',
    color: theme.palette.background.default,
  }
}));

/** Button in form of a checkmark */
const DoneButton = (props) => {
  const classes = useStyles();
  const { onClick } = props;

  return (
      <Check fontSize="large" className={classes.doneButton} onClick={onClick} />
  );
}

DoneButton.propTypes = {
  onClick: func.isRequired,
};

export default DoneButton;
