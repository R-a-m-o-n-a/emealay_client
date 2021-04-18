import React from 'react';
import { func } from "prop-types";
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  navButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  }
});

/** Button in form of a magnifying glass */
const SearchButton = (props) => {
  const classes = useStyles();
  const { onClick } = props;

  return (
      <Search fontSize="large" className={classes.navButton} onClick={onClick} />
  );
}

SearchButton.propTypes = {
  onClick: func.isRequired,
};

export default SearchButton;
