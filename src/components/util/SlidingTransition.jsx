import React from "react";
import Slide from "@material-ui/core/Slide";

/** Provides sliding in from the right side effect to Dialog components */
export const SlidingTransitionLeft = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
