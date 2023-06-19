import React from 'react';
import { func } from "prop-types";
import { IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  editButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '2rem',
    color: theme.palette.background.default,
    padding: 0,
  },
  editIcon: {
    fontSize: '1.8rem',
  }
}));

/** Button in form of a pencil icon */
const EditButton = (props) => {
  const classes = useStyles();
  const { onClick } = props;

  return (
    <IconButton className={classes.editButton} onClick={onClick}><Edit className={classes.editIcon} /></IconButton>
  );
}

EditButton.propTypes = {
  onClick: func.isRequired,
};

export default EditButton;
