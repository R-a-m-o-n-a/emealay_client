import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { arrayOf, shape, string } from "prop-types";
import React from "react";
import { makeStyles } from "@material-ui/styles";
import { ContactAvatar } from "../Social/social.util";

const useStyles = makeStyles(theme => ({
  backgroundColor: {
    color: theme.palette.background.default,
    backgroundColor: theme.palette.text.secondary,
  }
}));

/**
 * Get Meal's main image
 * @param meal
 * @returns {Object} main image of meal, or first image, if no main image set
 */
export const getMainImage = (meal) => {
  const mainImage = meal.images.find((i) => i.isMain);
  return mainImage || meal.images[0];
}

/** A Meal's Avatar: meal's main image or the general meal icon (if no image provided) in MUI Avatar format */
const MealAvatar = (props) => {
  const classes = useStyles();
  const { meal } = props;

  if (meal.images.length > 0) {
    const image = getMainImage(meal);
    return <ContactAvatar alt={image.name} src={image.url} />;
  } else {
     return <ContactAvatar className={classes.backgroundColor}><FontAwesomeIcon icon={faUtensils} /></ContactAvatar>;
  }
}

MealAvatar.propTypes = {
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
}

export default MealAvatar;
