import React from 'react';
import { alpha, Box, Switch } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { func, object } from "prop-types";

const SWITCH_WIDTH = 58;
const SWITCH_HEIGHT = 36;
const SWITCH_PADDING = 6;

const useStyles = makeStyles((theme) => ({
  iconOn: {
    fontSize: "1rem",
  },
  iconOff: {
    fontSize: "1rem",
    color: alpha(theme.palette.text.primary, 0.4),
  },
}));

/** This is a wrapper the Outlined TextField that is used mostly throughout the app.
 * It bundles common attributes and styles.
 * Any other Attributes for a MUI TextField are passed through to the actual component */
const IconSwitch = (props) => {
  const classes = useStyles();

  const { IconOn, IconOff, iconOnProps, iconOffProps, checked, onChange, boxStyle, ...otherProps } = props;

  return (
    /*<FormControlLabel label={iconOff} style={{
      marginLeft: 0,
      marginRight: 0,
    }} control={*/
    <Box style={{position: "relative", cursor: "pointer", ...boxStyle}} onClick={onChange}>
      <StyledSwitch checked={checked} {...otherProps} icon={<IconOff {...iconOffProps} className={classes.iconOff} />} checkedIcon={<IconOn {...iconOnProps} className={classes.iconOn} />} />
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
    height: `${SWITCH_HEIGHT-SWITCH_PADDING}px`,
    width: `${SWITCH_HEIGHT-SWITCH_PADDING}px`,
    left: `${SWITCH_PADDING/2}px`,
    top: `${SWITCH_PADDING/2}px`,
    backgroundColor: "white",
    padding: 0,
    '&:hover': {
      backgroundColor: alpha("#ffffff", 0.9),
    },
    '&$checked': {
      transform: `translateX(${SWITCH_WIDTH-SWITCH_HEIGHT}px)`,
      '&:hover': {
        backgroundColor: alpha("#ffffff", 0.9),
      },
    }
  },
  thumb: {
    height: `${SWITCH_HEIGHT-SWITCH_PADDING}px`,
    width: `${SWITCH_HEIGHT-SWITCH_PADDING}px`,
  },
  track: {
    borderRadius: `${SWITCH_HEIGHT}px`,
    opacity: 0.2,
  },
  checked: {},
}))(Switch);

IconSwitch.propTypes = {
  IconOn: func.isRequired,
  IconOff: func.isRequired,
  iconOnProps: object,
  iconOffProps: object,
  boxStyle: object,
}

IconSwitch.defaultProps = {
  iconOnProps: {},
  iconOffProps: {},
  boxStyle: {},
}

export default IconSwitch;
