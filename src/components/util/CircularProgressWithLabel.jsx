import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { number } from "prop-types";

/** Countdown that will be displayed as a number of seconds remaining surrounded by a circular progress that runs in reverse from initialValue to 0, updates every second */
export default function CircularProgressWithLabel(props) {
  const { initialValue, step } = props;
  const [currentValue, setCurrentValue] = useState(initialValue);

  useEffect(() => {
    let interval = setInterval(() => {
      setCurrentValue(currentValue => currentValue === 0 ? currentValue : currentValue - step);
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <Box position="relative" display="inline-flex" style={{alignSelf: 'center'}}>
      <CircularProgress variant="determinate" style={{ color: 'white', height: '22px', width: '22px' }} value={currentValue/initialValue*100} />
      <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="caption" component="div">{currentValue}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /** initial value of countdown in seconds */
  initialValue: number.isRequired,
  /** number of seconds that will be subtracted each second */
  step: number,
};

CircularProgressWithLabel.defaultProps = {
  step: 1,
};
