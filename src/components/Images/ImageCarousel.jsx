import React, { useCallback, useEffect, useState } from 'react';
import { arrayOf, func, number, shape, string, } from 'prop-types';
import BoxCloseX from '../Buttons/BoxCloseX';
import Carousel from 'react-material-ui-carousel';
import { makeStyles } from '@material-ui/styles';
import { Box, Link } from "@material-ui/core";

const useStyles = makeStyles({
  carouselBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0, 0.8)',
    zIndex: 2000,
  },
  imageCarousel: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '85vh',
    maxWidth: '90vw',
  },
  carouselItemImage: {
    maxHeight: '85vh',
    maxWidth: '90vw',
    borderRadius: '4px',
  }
});

/** full screen overlay containing image carousel */
const ImageCarousel = (props) => {
  const classes = useStyles();

  const { images, startIndex } = props;
  const [index, setIndex] = useState(startIndex);

  const slides = images.map((image, index) => (
    <Box key={index}>
      <Link href={image.url}>
        <img src={image.url} alt={image.name} className={classes.carouselItemImage} />
      </Link>
    </Box>
  ));

  useEffect(() => { // effect on each render (no dependency array)
    const backdrop = document.getElementById('carouselBackdrop');

    function handleBackDropClick(e) {
      if (e.target === this) props.dismissCarousel();
    }

    if (backdrop) {
      backdrop.addEventListener('click', handleBackDropClick);
      return () => backdrop.removeEventListener('click', handleBackDropClick);
    }
    return null;
  });

  // to change carousel images with arrow keys: key press event handler from https://codesandbox.io/s/h6l4h?file=/src/App.tsx:386-1091
  const changeActiveSlide = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        // If supposed previous child is < 0 set it to last child
        setIndex((a) => (a - 1 < 0 ? images.length - 1 : a - 1));
      } else if (e.key === "ArrowRight") {
        // If supposed next child is > length -1 set it to first child
        setIndex((a) => (a + 1 > images.length - 1 ? 0 : a + 1));
      }
    }, [images]);

  // Set and cleanup the event listener
  useEffect(() => {
    document.addEventListener("keydown", changeActiveSlide);

    return function cleanup() {
      document.removeEventListener("keydown", changeActiveSlide);
    };
  });

  return (
    <Box id="carouselBackdrop" className={classes.carouselBackdrop}>
      <Box className={classes.imageCarousel}>
        <Carousel autoPlay={false} timeout={0} index={index} indicators>
          {slides}
        </Carousel>
        <BoxCloseX onClick={props.dismissCarousel} />
      </Box>
    </Box>
  );
};

ImageCarousel.propTypes = {
  /** all images that can be scrolled through in the carousel, including name (that will be the altText) and relative path to serverURL */
  images: arrayOf(shape({
    name: string,
    url: string,
  })).isRequired,
  /** Array index number of image that will be displayed first */
  startIndex: number,
  /** function that hides the carousel */
  dismissCarousel: func.isRequired,
};

ImageCarousel.defaultProps = {
  startIndex: 0,
};

export default ImageCarousel;
