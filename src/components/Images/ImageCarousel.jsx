import React, { useEffect } from 'react';
import { arrayOf, func, number, shape, string, } from 'prop-types';
import BoxCloseX from '../Buttons/BoxCloseX';
import Carousel from 'react-material-ui-carousel';
import { makeStyles } from '@material-ui/styles';
import { Box, Link } from "@material-ui/core";

const serverURL = process.env.REACT_APP_SERVER_URL;

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

  const slides = images.map((image, index) => (
    <Box key={index}>
      <Link href={serverURL + image.path}>
        <img src={serverURL + image.path} alt={image.name} className={classes.carouselItemImage} />
      </Link>
    </Box>
  ));

  useEffect(() => {
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

  return (
    <Box id="carouselBackdrop" className={classes.carouselBackdrop}>
      <Box className={classes.imageCarousel}>
        <Carousel autoPlay={false} index={startIndex} indicators>
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
    path: string,
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
