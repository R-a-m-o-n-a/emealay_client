import React from 'react';
import { bool, func, string } from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from "@material-ui/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  dragAccept: {
    borderColor: theme.palette.primary.main,
  },
  dragReject: {
    borderColor: theme.palette.error.main,
  },
  middleIcon: {
    margin: 'auto',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    '&:hover': {
      color: theme.palette.primary.main,
    }
  }
}));

/** Dropzone that will wrap around elements that are passed as children
 * + accepts all images with a size of max. 10MB */
function PhotoDropzone(props) {

  const classes = useStyles();
  const { multiple, dropZoneStyles, usePlusIcon } = props;

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: ['image'],
    maxSize: 10485760,
    multiple: multiple,
    onDrop(acceptedFiles, rejectedFiles, event) {
      props.handleAcceptedFiles(acceptedFiles);
      props.handleRejectedFiles(rejectedFiles);
    }
  });

  let dragStateClass = null;
  if (isDragAccept) dragStateClass += classes.dragAccept; // only true if all of the files are accepted
  if (isDragReject) dragStateClass += classes.dragReject; // if only one file is not accepted only isDragReject is true and isDragAccept is false

  return (
    <Box {...getRootProps({ className: `${dropZoneStyles} ${dragStateClass}` })}>
      <input {...getInputProps()} />
      {props.children}
      {usePlusIcon ? <Box className={classes.middleIcon}><FontAwesomeIcon icon={faPlusCircle} size="2x" /></Box> : null}
    </Box>
  );
}

PhotoDropzone.propTypes = {
  /** function that handles accepted files */
  handleAcceptedFiles: func.isRequired,
  /** function that handles rejected files */
  handleRejectedFiles: func.isRequired,
  /** allow uploading more than one image? */
  multiple: bool,
  /** pass any className for styles to be applied to dropZone */
  dropZoneStyles: string,
  /** display plus icon in the center of the dropzone? */
  usePlusIcon: bool,
};

PhotoDropzone.defaultProps = {
  multiple: false,
  usePlusIcon: false,
}

export default PhotoDropzone;
