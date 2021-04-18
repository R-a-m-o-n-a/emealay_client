import React from 'react';
import { func } from "prop-types";
import { Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  navButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: theme.palette.background.default,
  }
}));

/** Button in form of a plus icon */
const AddButton = (props) => {
  const classes = useStyles();
  const { onClick } = props;

  return (
      <Add fontSize="large" className={classes.navButton} onClick={onClick} />
  );
}

AddButton.propTypes = {
  onClick: func.isRequired,
};

export default AddButton;
