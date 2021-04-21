import React from 'react';
import { bool, string } from "prop-types";
import { makeStyles } from '@material-ui/styles';
import { Box, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles({
  imageCropper: {
    width: '100%',
    height: '100%',
    position: "relative",
    overflow: "hidden",
    borderRadius: '100%',
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    display: "block",
    height: '100%',
    width: "auto",
  },
});

/** Image cropped to circular shape */
const CircleImage = (props) => {
  const classes = useStyles();
  const { src, altText, loading } = props;

  return (
    <Box className={classes.imageCropper}>
      {loading ? <CircularProgress color="secondary" style={{ width: '110px', height: '110px', }} /> :
        <img src={src} alt={altText} className={classes.image} />}
    </Box>
  );
}

CircleImage.propTypes = {
  /** complete path of the image source */
  src: string.isRequired,
  /** alternative text if image cannot be displayed */
  altText: string.isRequired,
  /** shows progress instead of image */
  loading: bool,
};

CircleImage.propTypes = {
  loading: false,
};

export default CircleImage;
