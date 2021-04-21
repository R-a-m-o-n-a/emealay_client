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
    transform: 'translate(-25%, 25%)',
    borderRadius: '100%',
    border: '1px solid ' + theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    padding: 0,
    background: 'transparent',
    // opacity: '80%',

    '&:hover': {
      color: theme.palette.error.main,
      cursor: 'pointer',
      boxShadow: '0 0 0.5rem ' + theme.myColors.white,
    },
  },
  closeXIcon: {
    fontSize: '1.5rem',
    lineHeight: '1.5rem',
  },
  xBackground: {
    color: theme.palette.error.main,
  },
  x: {
    color: theme.myColors.white,
  }
}));

/** Button that is an x within a black circle that turns red on hovering, located **within** top right corner of parent */
function InnerBoxCloseX(props) {
  const classes = useStyles();

  const { onClick } = props;

  return (
    <button type="button" className={classes.boxCloseX} onClick={onClick}>
      <span className={`${classes.closeXIcon} fa-layers`}>
        <FontAwesomeIcon icon={faCircle} className={classes.x}  />
        <FontAwesomeIcon icon={faTimesCircle} className={classes.xBackground} transform="shrink--2" />
      </span>
    </button>
  );
}

InnerBoxCloseX.propTypes = {
  onClick: func.isRequired,
};

export default InnerBoxCloseX;
