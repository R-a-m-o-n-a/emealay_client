import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { arrayOf, bool, func, shape, string } from "prop-types";
import { useTranslation } from "react-i18next";
import ImageUpload from "../Images/ImageUpload";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { LoadingBody } from "../Loading";
import SelectMealCategory from "./SelectMealCategory";
import SelectMealTags from "./SelectMealTags";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: '100%',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  outlinedInput: {
    padding: '14px',
  },
  errorTextField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
    }
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  listItemIcon: {
    fontSize: "1rem",
    color: theme.palette.text.primary,
    minWidth: '2rem',
  },
  chip: {
    margin: 2,
  },
}));

/** component is used by AddMeal and EditMeal and provides their shared core elements: text and photo input.
 *  Does not handle communication to server */
const EditMealCore = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    updateMeal,
    meal: {
      _id: mealId,
      title,
      recipeLink,
      comment,
      images,
      tags,
      category,
    },
    isSecondary,
  } = props;

  // const colorA = isSecondary ? "primary" : "secondary";
  const colorB = isSecondary ? "secondary" : "primary";

  const [, updateState] = useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const onChangeUploadedImages = (newUploadedImages) => {
    console.log('updated uploadedImages', newUploadedImages);
    updateMeal('images', newUploadedImages);
    forceUpdate(); // I don't know why the component does not rerender on state change but this solution fixes it. Source: https://stackoverflow.com/questions/53215285/how-can-i-force-component-to-re-render-with-hooks-in-react
  }

  return (
    <>
      <TextField className={classes.textField}
                 inputProps={{className: classes.outlinedInput}}
                 value={title}
                 color={colorB}
                 name="title"
                 onChange={e => updateMeal('title', e.target.value)}
                 label={t('Meal Title')}
                 variant="outlined"
                 autoFocus
                 required />
      <TextField className={classes.textField}
                 inputProps={{className: classes.outlinedInput}}
                 color={colorB}
                 value={recipeLink}
                 name="recipeLink"
                 onChange={e => updateMeal('recipeLink', e.target.value)}
                 label={t('Link to Recipe')}
                 variant="outlined" />
      <TextField multiline
                 rowsMax={10}
                 color={colorB}
                 className={classes.textField}
                 value={comment}
                 name="comment"
                 onChange={e => updateMeal('comment', e.target.value)}
                 label={t('Comment')}
                 variant="outlined" />

      <SelectMealCategory currentCategory={category} updateMeal={updateMeal} />

      <SelectMealTags currentTags={tags} updateTags={(newTags) => {updateMeal('tags', newTags)}} allowCreate />

      <ImageUpload multiple uploadedImages={images} category="mealImages" categoryId={mealId} onChangeUploadedImages={onChangeUploadedImages} />
    </>
  );
}

EditMealCore.propTypes = {
  /** setState function of the parent component's meal that takes key and value of attribute and updates it */
  updateMeal: func.isRequired,
  /** meal to be edited */
  meal: shape({
    _id: string,
    title: string,
    images: arrayOf(shape({
      name: string,
      path: string,
    })),
    recipeLink: string,
    comment: string,
    category: string,
    tags: arrayOf(string),
  }).isRequired,
  /** whether to use primary or secondary color scheme */
  isSecondary: bool,
}

EditMealCore.defaultProps = {
  isSecondary: false,
}

export default withAuthenticationRequired(EditMealCore, {
  onRedirecting: () => <LoadingBody />,
});

