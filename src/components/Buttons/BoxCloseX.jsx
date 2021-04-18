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

    '&:hover': {
      color: theme.palette.error.main,
      textDecoration: 'underline',
      cursor: 'pointer',
    },

    '&::last-child': {
      marginRight: '1.4rem',
    },

    'svg:hover': {
      borderRadius: '100%',
      boxShadow: '0 0 0.5rem ' + theme.palette.background.default,
    },
  },
  closeXIcon: {
    fontSize: '1.5rem',
    lineHeight: '1.5rem',
  },
  white: {
    color: theme.palette.background.default,
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
        <FontAwesomeIcon icon={faTimesCircle} transform="shrink--2" />
      </span>
    </button>
  );
}

BoxCloseX.propTypes = {
  onClick: func.isRequired,
};

export default BoxCloseX;
