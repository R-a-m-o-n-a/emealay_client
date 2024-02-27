import React from 'react';
import { alpha, Box, Switch } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { func, number, object } from "prop-types";

const SWITCH_WIDTH = 65;
const SWITCH_HEIGHT = 36;
const SWITCH_PADDING = 6;

const useStyles = makeStyles((theme) => ({
  iconLeft: {
    fontSize: "1rem",
    color: alpha(theme.palette.text.primary, 0.8),
  },
  iconMiddle: {
    fontSize: "1rem",
    color: alpha(theme.palette.text.primary, 0.4),
  },
  iconRight: {
    fontSize: "1rem",
  },
}));


/** This is a wrapper the Outlined TextField that is used mostly throughout the app.
 * It bundles common attributes and styles.
 * Any other Attributes for a MUI TextField are passed through to the actual component */
const TriStateIconSwitch = (props) => {
  const classes = useStyles();

  const {  IconLeft, IconMiddle, IconRight, iconLeftProps, iconMiddleProps, iconRightProps, value, setValue, boxStyle, ...otherProps } = props;

  function toggleTriState(e) {
    console.log("tristateswitch", e, value);
    setValue(oldValue => {
      switch (oldValue) {
        case 0: return 1;
        case 1: return -1;
        case -1: return 0;
        default: return 0;
      }
      }
    );
  }

  return (
    /*<FormControlLabel label={iconOff} style={{
      marginLeft: 0,
      marginRight: 0,
    }} control={*/
    <Box style={{ position: "relative", cursor: "pointer", ...boxStyle }} onClick={toggleTriState}>
      <StyledSwitch checked={value===1} disabled={value===0} {...otherProps}
                    icon={value===0 ? <IconMiddle {...iconMiddleProps} className={classes.iconMiddle} /> : <IconLeft {...iconLeftProps} className={classes.iconLeft} />}
                    checkedIcon={<IconRight {...iconRightProps} className={classes.iconRight} />} />
    </Box>
    /* } />*/
  );
}

const StyledSwitch = withStyles((theme) => ({
  root: {
    padding: 0,
    width: `${SWITCH_WIDTH}px`,
    height: `${SWITCH_HEIGHT}px`,
  },
  switchBase: {
    height: `${SWITCH_HEIGHT - SWITCH_PADDING}px`,
    width: `${SWITCH_HEIGHT - SWITCH_PADDING}px`,
    left: `${SWITCH_PADDING / 2}px`,
    top: `${SWITCH_PADDING / 2}px`,
    backgroundColor: "white",
    padding: 0,
    '&:hover': {
      backgroundColor: alpha("#ffffff", 0.9),
    },
    '&$checked': {
      transform: `translateX(${SWITCH_WIDTH - SWITCH_HEIGHT}px)`,
      '&:hover': {
        backgroundColor: alpha("#ffffff", 0.9),
      },
    },
    '&$disabled': {
      backgroundColor: "white",
      color: theme.palette.primary.main,
      transform: `translateX(${(SWITCH_WIDTH - SWITCH_HEIGHT)/2}px)`,
      '&:hover': {
        backgroundColor: alpha("#ffffff", 0.9),
      },
      '& + .MuiSwitch-track': {
        backgroundColor: "000000",
        opacity: 0.2,
      }
    }
  },
  thumb: {
    height: `${SWITCH_HEIGHT - SWITCH_PADDING}px`,
    width: `${SWITCH_HEIGHT - SWITCH_PADDING}px`,
  },
  track: {
    borderRadius: `${SWITCH_HEIGHT}px`,
    backgroundColor: theme.palette.text.primary,
    opacity: 0.6,
  },
  checked: {},
  disabled: {} // for some reason it is very important to keep this.
}))(Switch);

TriStateIconSwitch.propTypes = {
  IconLeft: func.isRequired,
  IconMiddle: func.isRequired,
  IconRight: func.isRequired,
  iconLeftProps: object,
  iconMiddleProps: object,
  iconRightProps: object,
  boxStyle: object,
  value: number.isRequired,
  setValue: func.isRequired,
}

TriStateIconSwitch.defaultProps = {
  iconRightProps: {},
  iconLeftProps: {},
  boxStyle: {},
}

export default TriStateIconSwitch;
