import React, { useEffect, useState } from 'react';
import { arrayOf, bool, func, number, shape, string } from "prop-types";
import { useTranslation } from "react-i18next";
import ImageUpload from "../Images/ImageUpload";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { LoadingBody } from "../Loading";
import SelectMealCategory from "./SelectMealCategory";
import SelectMealTags from "./SelectMealTags";
import OutlinedTextField from "../util/OutlinedTextField";
import { fetchAndUpdateMealsFromUser } from "./meals.util";
import { Checkbox, FormControlLabel } from "@material-ui/core";

/** component is used by AddMeal and EditMeal and provides their shared core elements: text and photo input as well as choosing a category and adding tags.
 *  Does not handle communication to server. */
const EditMealCore = (props) => {
  const { t } = useTranslation();
  const { user } = useAuth0();

  const {
    updateMeal,
    meal: {
      _id: mealId,
      title,
      recipeLink,
      comment,
      images,
      category,
      isToTry,
      tags,
    },
    isSecondary,
    autoFocusFirstInput,
    setImagesLoading,
    setLoadingImagesTakesLong,
    loadingImagesTakesLongAfter,
  } = props;

  const [placeholder, setPlaceholder] = useState(t('Recipe, instructions, comments, etc.'));

  const [loadingImagesTakesLongTimeout, setLoadingImagesTakesLongTimeout] = useState(0);

  const onChangeUploadedImages = (newUploadedImages) => {
    // console.log('updated uploadedImages', newUploadedImages);
    updateMeal('images', Array.from(newUploadedImages));
  }

  useEffect(() => {
    if (user) {
      fetchAndUpdateMealsFromUser(user.sub, meals => {
        if (meals.length < 3) setPlaceholder(t('You can use this field to add a recipe in text form, instructions, experience or other comments.'));
      })
    }
    // eslint-disable-next-line
  }, [user]);

  const setLoadingAndStartTimeout = (value) => {
    if(setImagesLoading) setImagesLoading(value);
    if(setLoadingImagesTakesLong) {
      if (value === true) {
        setLoadingImagesTakesLongTimeout(setTimeout(() => {
          setLoadingImagesTakesLong(true);
        }, loadingImagesTakesLongAfter));
      }
      if (value === false) {
        clearTimeout(loadingImagesTakesLongTimeout);
        setLoadingImagesTakesLongTimeout(0);
        setLoadingImagesTakesLong(false);
      }
    }
  };

  return (
    <>
      <OutlinedTextField name="title"
                         value={title}
                         label={t('Meal Title')}
                         onChange={e => updateMeal('title', e.target.value)}
                         isSecondary={isSecondary}
                         autoFocus={autoFocusFirstInput}
                         required />
      <OutlinedTextField name="recipeLink" value={recipeLink} label={t('Link to Recipe')} onChange={e => updateMeal('recipeLink', e.target.value)} isSecondary={isSecondary} />
      <OutlinedTextField multiline
                         maxRows={10}
                         minRows={1}
                         name="comment"
                         placeholder={placeholder}
                         value={comment}
                         onChange={e => updateMeal('comment', e.target.value)}
                         isSecondary={isSecondary} />

      <FormControlLabel label={t('To Try?')} control={
        <Checkbox checked={isToTry ?? false} onChange={e => updateMeal('isToTry', e.target.checked)} color={"primary"} />
      } />

      <SelectMealCategory currentCategory={category} updateMeal={updateMeal} />

      <SelectMealTags own currentTags={tags} updateTags={(newTags) => {updateMeal('tags', newTags)}} allowCreate />

      <ImageUpload multiple
                   uploadedImages={images}
                   category="mealImages"
                   categoryId={mealId}
                   onChangeUploadedImages={onChangeUploadedImages}
                   imageName={title}
                   tags={tags}
                   setLoading={setLoadingAndStartTimeout} />
    </>
  );
}

EditMealCore.propTypes = {
  /** setState function of the parent component's meal that takes key and value of attribute and updates it */
  updateMeal: func.isRequired,
  /** meal to be edited */
  meal: shape({
    _id: string,
    userId: string,
    title: string,
    images: arrayOf(shape({
      name: string,
      url: string,
    })),
    recipeLink: string,
    comment: string,
    category: string,
    tags: arrayOf(string),
  }).isRequired,
  /** whether to use primary or secondary color scheme */
  isSecondary: bool,
  /** whether to autofocus title input (will open keyboard on smartphones) */
  autoFocusFirstInput: bool,
  /** this is a function to update the state of the calling component. It will receive false, if all images of the meal have been uploaded, and true otherwise */
  setImagesLoading: func,
  /** this is a function to update the state of the calling component. It will receive true, if all images have not loaded after the specified interval */
  setLoadingImagesTakesLong: func,
  /** interval for setLoadingImagesTakesLong  */
  loadingImagesTakesLongAfter: number,
}

EditMealCore.defaultProps = {
  isSecondary: false,
  autoFocusFirstInput: false,
  setImagesLoading: undefined,
  setLoadingImagesTakesLong: undefined,
  loadingImagesTakesLongAfter: process.env.REACT_APP_LOADING_TAKES_LONG_AFTER || 8000,
}

export default withAuthenticationRequired(EditMealCore, {
  onRedirecting: () => <LoadingBody />,
});

