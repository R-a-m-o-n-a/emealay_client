import React, { useState } from 'react';
import PhotoDropzone from './PhotoDropzone';
import ImageGrid from './ImageGrid.jsx';
import axios from "axios";
import { array, arrayOf, bool, func, oneOfType, shape, string } from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Box, GridList, GridListTile, Snackbar } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCircle } from "@fortawesome/free-solid-svg-icons";
import CircleImage from "./CircleImage";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  placeholderTile: {
    height: 'calc(100% - 4px)',
    width: 'calc(100% - 4px)',
    border: '2px double ' + theme.myColors.white,
    color: theme.myColors.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
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

  const { uploadedImages, category, categoryId, onChangeUploadedImages, multiple, imageName, useSingleUploadOverlay, tags } = props;
  const altText = imageName || category;

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
    Array.from(imagesToUpload).forEach((image, index) => {
      const data = new FormData();
      let folderParam = '';
      if (category) {
        data.append('category', category);
        data.append('categoryId', categoryId);
        folderParam = category;
      }
      if (tags) data.append('tags', tags);
      const name = index > 0 ? altText + index : altText;
      data.append('name', name);
      data.append('image', image);

      onChangeUploadedImages(uploadedImages.filter(i => i !== image))

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

    axios.post(serverURL + "/images/deleteImage", image)
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
        return <GridListTile key={'placeholder' + index} cols={index === 0 ? 2 : 1} className={classes.dropzoneTile}>
          <Box className={classes.placeholderTile}><CircularProgress color="inherit" /></Box>
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
            </GridListTile>
            {getPhotoPlaceholders()}
          </ImageGrid>
        </GridList>
        :
        <Box className={classes.singlePhotoUpload}>
          <PhotoDropzone handleAcceptedFiles={handleAcceptedFiles}
                         handleRejectedFiles={handleRejectedFiles}
                         dropZoneStyles={uploadedImages.length === 0 ? classes.photoDropzoneSingleEmpty : classes.photoDropzoneSingle}
                         usePlusIcon={uploadedImages.length === 0}>
            <CircleImage src={uploadedImages[0]} altText={altText} loading={photosToUpload.length>0} />
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
    url: string,
  }), string])),
  /** category/folder name of the image, e.g., mealImages or userProfile (make sure that folder exists in uploads folder!) */
  category: string.isRequired,
  /** ID within the category, e.g., mealId or userId */
  categoryId: string.isRequired,
  /** function that updates the image(s) */
  onChangeUploadedImages: func.isRequired,
  /** if multiple === false this name is the alt tag of the single uploaded image, if multiple === true, an index number will be appended.
   * if not supplied, the category will be used */
  imageName: string,
  /** array of tags that will be given to the image (optional) */
  tags: array,
  /** overlay single image upload area with a transparent camera icon */
  useSingleUploadOverlay: bool,
}

ImageUpload.defaultProps = {
  multiple: false,
  uploadedImages: [],
  tags: [],
  useSingleUploadOverlay: false,
}

export default ImageUpload;
