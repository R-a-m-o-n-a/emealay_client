import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { bool } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  loadingCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-12px',
    marginLeft: '-12px',
  }
}));

// while saving display progress spinner
const SavingButton = ({ children, ...props }) => {

  const classes = useStyles();
  const { isSaving, disabled, ...buttonProps } = props;

  return (
    <>
      <Button disabled={isSaving || disabled} {...buttonProps}>
        {children}
        {isSaving && (
          <CircularProgress size={24} color="inherit" className={classes.loadingCircle} />
        )}
      </Button>
    </>
  );
};

SavingButton.propTypes = {
  // true while saving, otherwise false
  isSaving: bool.isRequired,
  disabled: bool,
};

SavingButton.defaultProps = {
  disabled: false,
};

export default SavingButton;
