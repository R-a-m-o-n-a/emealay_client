import React from 'react';
import { func } from "prop-types";
import { Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  deleteButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: theme.palette.error.main,
    padding: 0,
  }
}));

/** Button in form of a trashcan icon */
const DeleteButton = (props) => {
  const classes = useStyles();
  const { onClick } = props;

  return (
    <IconButton className={classes.deleteButton} onClick={onClick}><Delete /></IconButton>
  );
}

DeleteButton.propTypes = {
  onClick: func.isRequired,
};

export default DeleteButton;
