import React, { useState } from 'react';
import PhotoDropzone from './PhotoDropzone';
import ImageGrid from './ImageGrid.jsx';
import axios from "axios";
import { arrayOf, bool, func, oneOfType, shape, string } from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Box, GridList, GridListTile, Snackbar } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCircle } from "@fortawesome/free-solid-svg-icons";
import CircleImage from "./CircleImage";

const serverURL = process.env.REACT_APP_SERVER_URL;

const useStyles = makeStyles((theme) => ({
  photoDropzoneMultiple: {
    height: 'calc(100% - 4px)',
    width: 'calc(100% - 4px)',
    border: '2px dashed ' + theme.palette.secondary.main,
    '&:hover': {
      cursor: 'pointer',
    },
    // marginLeft: '2px', // borderWidth for alignment
  },
  singlePhotoUpload: {
    width: '8rem',
    height: '8rem',
    margin: 'auto',
    position: 'relative', // important to have photoDropzone align
    borderRadius: '100%',
  },
  photoDropzoneSingle: {
    position: "relative",
    height: '100%',
    width: '100%',
    border: 'none',
    '&:hover': {
      cursor: 'pointer',
    },
    borderRadius: '100%',
  },
  photoDropzoneSingleEmpty: {
    height: 'calc(100% - 4px)',
    width: 'calc(100% - 4px)',
    border: '2px dashed ' + theme.palette.secondary.main,
    '&:hover': {
      cursor: 'pointer',
    },
    borderRadius: '100%',
  },
  photoRow: {
    marginTop: '-0.5rem',
    paddingTop: '0.5rem',
    marginBottom: '0.25rem',
    width: '100%',
    borderRadius: '0.25rem',
    overflowX: 'auto',
    overflowY: 'hidden',
    display: 'flex',
    flexWrap: 'nowrap',
    flex: 1,
    color: theme.palette.secondary.main,
  },
  photoBoxPlaceholder: {
    display: 'inlineBlock',
    height: '7rem',
    maxHeight: '7rem',
    width: '4.5rem',
    flex: '0 0 auto',
    border: '1px solid ' + theme.palette.secondary.main,
    borderRadius: '0.25rem',
    margin: '0.5rem',
    position: 'relative',
    wordWrap: 'anywhere',
  },
  gridList: {
    width: '100%',
    marginTop: '0.5rem !important',
    marginBottom: '0.5rem !important',
  },
  dropzoneTile: {
    width: '33.3333%',
    padding: '2px',
    height: process.env.REACT_APP_GRID_LIST_ROW_HEIGHT + 4 + 'px',
  },
  cameraOverlay: {
    position: "absolute",
    height: '100%',
    width: '100%',
    top: 0,
    borderRadius: '100%',
  },
  overlayIcon: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '8rem',
  },
  snackbarOffset: {
    bottom: parseInt(process.env.REACT_APP_NAV_BOTTOM_HEIGHT) + 10 + 'px',
  },
  rejectSnackbar: {
    backgroundColor: theme.palette.error.light,
  },
}));

/** Image Upload that includes the display of the images that have been uploaded.
 *  Either single image or multiple images, which affects the look:
 *  ### Multiple Image Upload
 *  + images will be displayed as `Image Grid`, with a Dropzone being the first tile
 *  ### Single Image Upload
 *  + image needs to be wrapped in an array
 *  + will be displayed as a circular image with an optional overlay of a camera icon
 */
const ImageUpload = (props) => {
  const classes = useStyles();

  const { uploadedImages, category, categoryId, onChangeUploadedImages, multiple, imageName, useSingleUploadOverlay } = props;

  const [photosToUpload, setPhotosToUpload] = useState([]);
  const [rejectMessageVisible, setRejectMessageVisible] = useState(false);
  const [rejectMessages, setRejectMessages] = useState([]);

  const handleAcceptedFiles = (acceptedPhotos) => {
    if (acceptedPhotos.length > 0) {
      uploadImages(acceptedPhotos);
    }
  };

  const handleRejectedFiles = (rejectedPhotos) => {
    if (rejectedPhotos.length > 0) {
      console.log('rejected', rejectedPhotos);
      setRejectMessages(Array.from(rejectedPhotos).map((image) => {
        return image.file.name + ' was rejected. Reason: ' + image.errors[0].message;
        // reject codes
        // file-invalid-type
        // file-too-large
      }));
      setRejectMessageVisible(true);
    }
  };

  const uploadImages = (imagesToUpload) => {
    console.log('trying to upload images', imagesToUpload, ' to ', serverURL);
    setPhotosToUpload(imagesToUpload);
    Array.from(imagesToUpload).forEach((image) => {
      const data = new FormData();
      let folderParam = '';
      if (category) {
        data.append('category', category);
        data.append('categoryId', categoryId);
        folderParam = category;
      }
      data.append('image', image);

      axios.post(serverURL + "/images/addImage/" + folderParam, data, {})
           .then(res => {
             console.log('result of adding image', res);
             const reducedPhotosToUpload = photosToUpload.filter(i => i !== image);
             setPhotosToUpload(reducedPhotosToUpload);
             if (multiple) {
               const newUploadedImages = uploadedImages;
               newUploadedImages.push(res.data.Image);
               if (reducedPhotosToUpload.length === 0 && category === 'mealImages') {
                 newUploadedImages[0].isMain = true;
               }
               onChangeUploadedImages(newUploadedImages);
             } else {
               onChangeUploadedImages(res.data.Image);
             }
           }).catch(err => {console.log(err)});
    })
  }

  const deleteImage = (image) => {
    console.log('trying to Reset Image', image);

    const data = new FormData();
    data.append('path', image.path);
    const folderParam = category || '';
    axios.post(serverURL + "/images/deleteImage/" + folderParam + '/' + image._id, data)
         .then(res => {
           console.log('result of deleting planItem image', res);
           const newUploadedImages = uploadedImages.filter(i => i !== image);
           if (image.isMain && newUploadedImages.length > 0) {
             newUploadedImages[0].isMain = true;
           }
           onChangeUploadedImages(newUploadedImages);
         }).catch(err => {console.log(err)});
  }

  const chooseImageAsMain = (image) => {
    console.log('trying to set image as main', image);

    const changedUploadedImages = uploadedImages.map(i => {
      i.isMain = i._id === image._id;
      return i;
    });
    const newUploadedImages = [image];
    changedUploadedImages.forEach(i => {
      if (i !== image) newUploadedImages.push(i);
    })
    onChangeUploadedImages(newUploadedImages);
  }

  const getPhotoPlaceholders = () => {
    let placeholderBoxes = [];
    if (photosToUpload && photosToUpload.length > 0) {
      placeholderBoxes = photosToUpload.map((photo, index) => {
        return <GridListTile key={'placeholder' + index} cols={1} className={classes.dropzoneTile}>
          {/*<Box className={classes.photoBoxPlaceholder} key={i}>{photo.name}</Box>;*/}
          {photo.name}
        </GridListTile>
      });
    }

    return placeholderBoxes;
  };

  const rejectSnackbars = rejectMessages.map(m =>
    <Snackbar open={rejectMessageVisible} autoHideDuration={4000} onClose={() => {
      setRejectMessageVisible(false);
      setRejectMessages([])
    }} message={m} className={classes.snackbarOffset} ContentProps={{ className: classes.rejectSnackbar }} />);

  return (
    <>
      {multiple ?
        <GridList cellHeight={160} className={classes.gridList} cols={3}>
          <ImageGrid images={uploadedImages} allowDelete allowChoosingMain onDelete={deleteImage} onChoosingMain={chooseImageAsMain} disableSurroundingGrid>
            <GridListTile key={-1} cols={1} className={classes.dropzoneTile}>
              <PhotoDropzone multiple
                             usePlusIcon
                             handleAcceptedFiles={handleAcceptedFiles}
                             handleRejectedFiles={handleRejectedFiles}
                             dropZoneStyles={classes.photoDropzoneMultiple} />
            </GridListTile>,
            {getPhotoPlaceholders()}
          </ImageGrid>
        </GridList>
        :
        <Box className={classes.singlePhotoUpload}>
          <PhotoDropzone handleAcceptedFiles={handleAcceptedFiles}
                         handleRejectedFiles={handleRejectedFiles}
                         dropZoneStyles={uploadedImages.length === 0 ? classes.photoDropzoneSingleEmpty : classes.photoDropzoneSingle}
                         usePlusIcon={uploadedImages.length === 0}>
            <CircleImage src={uploadedImages[0]} altText={imageName} />
            {useSingleUploadOverlay ? <Box className={classes.cameraOverlay}>
              <FontAwesomeIcon className={classes.overlayIcon} icon={faCamera} mask={faCircle} transform="shrink-8" /></Box> : null}
          </PhotoDropzone>
        </Box>
      }
      {rejectSnackbars}
    </>
  );
}

ImageUpload.propTypes = {
  /** allow upload of more than one image? */
  multiple: bool,
  /** images that have been uploaded, must be updated through onChangeUploadedImages function.
   *  * If single image (multiple === false), complete source must be the (first or) only element of an array
   *  * If multiple needs to be array of name (alt-Tag) and relative path to serverURL
   */
  uploadedImages: arrayOf(oneOfType([shape({
    name: string,
    path: string,
  }), string])),
  /** category/folder name of the image, e.g., mealImages or userProfile (make sure that folder exists in uploads folder!) */
  category: string.isRequired,
  /** ID within the category, e.g., mealId or userId */
  categoryId: string.isRequired,
  /** function that updates the image(s) */
  onChangeUploadedImages: func.isRequired,
  /** if multiple === false this name is the alt tag of the single uploaded image */
  imageName: string,
  /** overlay single image upload area with a transparent camera icon */
  useSingleUploadOverlay: bool,
}

ImageUpload.defaultProps = {
  multiple: false,
  string: '',
  uploadedImages: [],
  useSingleUploadOverlay: false,
}

export default ImageUpload;
