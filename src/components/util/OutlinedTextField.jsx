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
  correctFloatingLabel: {
    transform: 'translate(14px, 12px) scale(1)',
  }
}));

/** This is a wrapper the Outlined TextField that is used mostly throughout the app.
 * It bundles common attributes and styles.
 * Any other Attributes for a MUI TextField are passed through to the actual component */
const OutlinedTextField = (props) => {
  const classes = useStyles();

  const { isSecondary, autocapitalize, ...otherProps } = props;

  return (
    <TextField className={classes.textField}
               inputProps={{autoCapitalize: autocapitalize}}
               InputProps={{ margin: 'dense' }}
               InputLabelProps={{ className: classes.correctFloatingLabel }}
               color={isSecondary ? "secondary" : "primary"}
               variant="outlined"
               {...otherProps} />
  );
}

OutlinedTextField.propTypes = {
  /** whether to use primary or secondary color scheme */
  isSecondary: bool,
}

OutlinedTextField.defaultProps = {
  isSecondary: false,
}

export default OutlinedTextField;
