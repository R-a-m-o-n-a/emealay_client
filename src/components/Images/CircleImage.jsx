import React from 'react';
import { string } from "prop-types";
import { makeStyles } from '@material-ui/styles';
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
  imageCropper: {
    width: '100%',
    height: '100%',
    position: "relative",
    overflow: "hidden",
    borderRadius: '100%',
  },
  image: {
    display: "block",
    position: "absolute",
    height: '100%',
    width: "auto",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

/** Image cropped to circular shape */
const CircleImage = (props) => {
  const classes = useStyles();
  const { src, altText } = props;

  return (
    <Box className={classes.imageCropper}>
      <img src={src} alt={altText} className={classes.image} />
    </Box>
  );
}

CircleImage.propTypes = {
  /** complete path of the image source */
  src: string.isRequired,
  /** alternative text if image cannot be displayed */
  altText: string.isRequired,
};

export default CircleImage;
