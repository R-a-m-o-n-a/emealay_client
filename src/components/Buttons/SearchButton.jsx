import React from 'react';
import { func } from "prop-types";
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  navButton: {
    color: theme.palette.background.default,
    padding: 0,
  }
}));

/** Button in form of a magnifying glass */
const SearchButton = (props) => {
  const classes = useStyles();
  const { onClick } = props;

  return (
    <IconButton className={classes.navButton} onClick={onClick}><Search fontSize="large" /></IconButton>
  );
}

SearchButton.propTypes = {
  onClick: func.isRequired,
};

export default SearchButton;
