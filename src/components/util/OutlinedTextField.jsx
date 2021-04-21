import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { bool } from "prop-types";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: '100%',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  outlinedInput: {
    padding: '14px',
  },
  correctFloatingLabel: {
    transform: 'translate(14px, 12px) scale(1)',
  }
}));

/** component is used by AddMeal and EditMeal and provides their shared core elements: text and photo input.
 *  Does not handle communication to server */
const OutlinedTextField = (props) => {
  const classes = useStyles();

  const { secondary } = props;

  return (
    <TextField className={classes.textField}
               InputProps={{ margin: 'dense' }}
               InputLabelProps={{ className: classes.correctFloatingLabel }}
               color={secondary ? "secondary" : "primary"}
               variant="outlined"
               {...props} />
  );
}

OutlinedTextField.propTypes = {
  /** whether to use primary or secondary color scheme */
  secondary: bool,
}

OutlinedTextField.defaultProps = {
  secondary: false,
}

export default OutlinedTextField;
