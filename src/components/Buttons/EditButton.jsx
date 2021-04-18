import React from 'react';
import { func } from "prop-types";
import { Edit } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  editButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1.5rem',
    color: theme.palette.background.default,
  }
}));

/** Button in form of a pencil icon */
const EditButton = (props) => {
  const classes = useStyles();
  const { onClick } = props;

  return (
      <Edit fontSize="large" className={classes.editButton} onClick={onClick} />
  );
}

EditButton.propTypes = {
  onClick: func.isRequired,
};

export default EditButton;
