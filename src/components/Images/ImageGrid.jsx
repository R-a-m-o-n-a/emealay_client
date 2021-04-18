import React, { useState } from 'react';
import ImageCarousel from './ImageCarousel';
import { makeStyles } from "@material-ui/styles";
import { arrayOf, bool, func, shape, string } from "prop-types";
import { GridList, GridListTile } from "@material-ui/core";
import InnerBoxCloseX from "../Buttons/InnerBoxCloseX";
import InnerBoxSelection from "../Buttons/InnerBoxSelection";

const serverURL = process.env.REACT_APP_SERVER_URL;

const useStyles = makeStyles((theme) => ({
  noButton: {
    background: 'none',
    border: 'none',
    padding: 0,
  },
  photoBox: {
    display: 'inlineBlock',
    height: '7rem',
    maxHeight: '7rem',
    width: 'auto',
    flex: '0 0 auto',
    border: '1px solid ' + theme.palette.secondary.main,
    borderRadius: '0.25rem',
    margin: '0.5rem',
    position: 'relative',
  },
  uploadedPhoto: {
    height: '7rem',
    maxHeight: '7rem',
    borderRadius: '0.25rem',
  },
  gridList: {
    width: '100%',
    marginTop: '0.5rem !important',
    marginBottom: '0.5rem !important',
  }
}));

/**
 * Image grid that displays an array of images in a 3 column grid and includes optional buttons to delete or select an image.
 * Height of each row can be controlled via `localhost.env.REACT_APP_GRID_LIST_ROW_HEIGHT`
 * allows children to be wrapped within ImageGrid component, they will be displayed within the grid, before the photos (e.g., Dropzone)
 */
const ImageGrid = (props) => {
  const classes = useStyles();

  const { images, allowDelete, allowChoosingMain, onDelete, onChoosingMain } = props;

  const [carouselShowing, setCarouselShowing] = useState(false);
  const [carouselStartKey, setCarouselStartKey] = useState(0);

  const deletePhoto = (photo) => {
    if (allowDelete) onDelete(photo)
  };

  const chooseAsMain = (photo) => {
    if (allowChoosingMain) onChoosingMain(photo)
  };

  const openImage = (photo, key) => {
    setCarouselShowing(true);
    setCarouselStartKey(key);
  };

  const getCarousel = (key) => {
    return <ImageCarousel images={images} startIndex={key} dismissCarousel={() => {setCarouselShowing(false);}} />;
  };

  const getPhotos = () => {
    let photoBoxes = [];
    if (images && images.length > 0) {
      photoBoxes = images.map((photo, index) => {
        return (
          <GridListTile key={index} cols={photo.isMain ? 2 : 1} >
            <img src={serverURL + photo.path} alt={photo.name} onClick={() => openImage(photo, index)}/>
            {allowChoosingMain ? <InnerBoxSelection selected={photo.isMain} onClick={() => chooseAsMain(photo)} /> : null}
            {allowDelete ? <InnerBoxCloseX onClick={() => deletePhoto(photo)} /> : null}
          </GridListTile>
        );
      });
    }
    return photoBoxes;
  };

  return (
    <>
      <GridList cellHeight={process.env.REACT_APP_GRID_LIST_ROW_HEIGHT} className={classes.gridList} cols={3}>
        {props.children}
        {getPhotos()}
      </GridList>
      {carouselShowing && getCarousel(carouselStartKey)}
    </>
  );
}

ImageGrid.propTypes = {
  /** all Images to display, including name (that will be the altText) and relative path to serverURL, as well as isMain boolean value (only necessary if allowChoosingMain === true) */
  images: arrayOf(shape({
    name: string,
    path: string,
    isMain: bool,
  })),
  /** should image deletion be allowed? (Otherwise delete button will not be shown) */
  allowDelete: bool,
  /** should user be allowed to choose main image? */
  allowChoosingMain: bool,
  /** function that deletes photo, only necessary if allowDelete === true */
  onDelete: func,
  /** function that chooses photo as main, only necessary if allowChoosingMain === true */
  onChoosingMain: func,
}

ImageGrid.defaultProps = {
  images: [],
  allowDelete: false,
  allowChoosingMain: false,
  onDelete: null,
  onChoosingMain: null,
}

export default ImageGrid;
