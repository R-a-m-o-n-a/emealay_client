import React from 'react';
import { faCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { func } from "prop-types";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  boxCloseX: {
    position: 'absolute',
    right: '0',
    top: '0',
    transform: 'translate(50%, -50%)',
    borderRadius: '100%',
    border: 'none',
    padding: 0,
    background: 'transparent',
  },
  closeXIcon: {
    fontSize: '1.5rem',
    lineHeight: '1.5rem',
  },
  white: {
    color: theme.myColors.white,
  },
  black: {
    color: theme.myColors.black,
  }
}));

/** Button that is an x within a black circle that turns red on hovering, center located on top right corner of parent */
function BoxCloseX(props) {
  const classes = useStyles();

  const { onClick } = props;

  return (
    <button type="button" className={classes.boxCloseX} onClick={onClick}>
      <span className={`${classes.closeXIcon} fa-layers`}>
        <FontAwesomeIcon icon={faCircle} className={classes.white} />
        <FontAwesomeIcon icon={faTimesCircle} className={classes.black} transform="shrink--2" />
      </span>
    </button>
  );
}

BoxCloseX.propTypes = {
  onClick: func.isRequired,
};

export default BoxCloseX;
