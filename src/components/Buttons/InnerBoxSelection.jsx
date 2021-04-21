import React from 'react';
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { bool, func } from "prop-types";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  boxCloseX: props => ({
    position: 'absolute',
    left: '0',
    top: '0',
    transform: 'translate(25%, 25%)',
    borderRadius: '100%',
    border: '1px solid ' + theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    padding: 0,
    background: 'transparent',
     opacity: props.selected ? '100%': '50%',

    '&:hover': {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      boxShadow: '0 0 0.5rem ' + theme.myColors.white,
    },
  }),
  closeXIcon: {
    fontSize: '1.5rem',
    lineHeight: '1.5rem',
  },
  xBackground: {
    color: theme.palette.primary.main,
  },
  x: {
    color: theme.myColors.white,
  }
}));

/** Button that is a checkmark within a green circle that turns opaque on hovering, located within the top left corner of parent */
function InnerBoxSelection(props) {
  const classes = useStyles(props);

  const { onClick } = props;

  return (
    <button type="button" className={classes.boxCloseX} onClick={onClick}>
      <span className={`${classes.closeXIcon} fa-layers`}>
        <FontAwesomeIcon icon={faCircle} className={classes.x}  />
        <FontAwesomeIcon icon={faCheckCircle} className={classes.xBackground} transform="shrink--2" />
      </span>
    </button>
  );
}

InnerBoxSelection.propTypes = {
  onClick: func.isRequired,
  selected: bool,
};

InnerBoxSelection.defaultProps = {
  selected: false,
};

export default InnerBoxSelection;
