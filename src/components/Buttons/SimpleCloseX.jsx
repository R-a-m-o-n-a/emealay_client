import React from 'react';
import { func } from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  boxCloseX: {
    position: 'absolute',
    right: '0',
    top: '0',
    transform: 'translate(-25%, 25%)',
    padding: 0,
    background: 'transparent',
    // opacity: '80%',

    '&:hover': {
      cursor: 'pointer',
    },
  },
  navButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  }
}));

/** Button in form of a big white X icon */
function SimpleCloseX(props) {
  const classes = useStyles();

  const { onClick } = props;

  return (
    <Close fontSize="large" className={classes.navButton} onClick={onClick} />
  );
}

SimpleCloseX.propTypes = {
  onClick: func.isRequired,
};

export default SimpleCloseX;
