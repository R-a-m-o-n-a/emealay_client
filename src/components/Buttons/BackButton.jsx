import React from 'react';
import { func } from "prop-types";
import { ArrowBackIos } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  backButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '28px',
    margin: '2px 0.5rem', // align placement with Logo
    color: theme.palette.background.default,
  }
}));

/** Button in form of a caret left icon */
const BackButton = (props) => {
  const classes = useStyles();
  const { onClick } = props;

  return (
      <ArrowBackIos className={classes.backButton} onClick={onClick} />
  );
}

BackButton.propTypes = {
  onClick: func.isRequired,
};

export default BackButton;
