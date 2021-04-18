/** File includes all helper methods for meals */
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { getSettingsOfUser } from "../Settings/settings.util";
import { darken, lighten } from "@material-ui/core";

const serverURL = process.env.REACT_APP_SERVER_URL;

/**
 * deletes all images from the server that belong to the given mealId
 * @param {string} mealId
 * @param {function} callback optional function tht will be executed after deletion
 */
export const deleteAllImagesFromMeal = (mealId, callback) => {
  axios.post(serverURL + '/images/deleteAllImagesFromCategory/mealImages/' + mealId)
       .then(res => {
         console.log('deleted all images from planItem ' + mealId + ' after timeout', res);
         callback();
       }).catch(err => {console.log(err)});
}

/**
 * Fetches all meals of the given user from the database (sorted alphabetically by title) and provides them as a parameter to the updateMeals function
 * @param {string} userId  ID of user whose meals shall be fetched from the database
 * @param {function} updateMeals  function that receives the meals and will update the state of the calling component
 */
export const fetchAndUpdateMealsFromUser = (userId, updateMeals) => {
  axios.get(serverURL + '/meals/ofUser/' + userId)
       .then(res => {
         updateMeals(res.data);
       })
       .catch(err => {
         console.log(err.message);
       });
}

/**
 * Fetches a single meal by ID from the database and provides it as a parameter to the updateMeal function
 * @param {string} mealId  ID of meals to be fetched from the database
 * @param {function} updateMeal  function that receives the meal and will update the state of the calling component
 */
export const fetchAndUpdateMeal = (mealId, updateMeal) => {
  axios.get(serverURL + '/meals/' + mealId)
       .then(res => {
         updateMeal(res.data);
       })
       .catch(err => {
         console.log(err.message);
       });
}

export const useCategoryIcons = () => {
  const { user } = useAuth0();

  const [allCategories, setAllCategories] = useState([]);
  const [allCategoryIcons, setAllCategoryIcons] = useState({});

  useEffect(() => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        setAllCategories(settings.mealCategories || []);
      });
    }
  }, [user]);

  useEffect(() => {
    allCategories.forEach(c => {
      setAllCategoryIcons(prevState => ({
        ...prevState,
        [c.name]: c.icon,
      }));
    });
  }, [allCategories]);

  return allCategoryIcons;
}

export const reactSelectTheme = (givenTheme, muiTheme, secondary = false) => {
  const muiPrimary = secondary ?  muiTheme.palette.secondary.main : muiTheme.palette.primary.main;
  const muiBackground = muiTheme.palette.background.default;
  const isLight = muiTheme.palette.type === 'light';
  const shade = (color, coefficient) => isLight ? darken(color, coefficient) : lighten(color, coefficient);
  const shadeInverse = (color, coefficient) => isLight ? lighten(color, coefficient) : darken(color, coefficient);

  givenTheme.colors = {
    primary: muiPrimary,
    primary75: shadeInverse(muiPrimary, 0.25),
    primary50: shadeInverse(muiPrimary, 0.5),
    primary25: shadeInverse(muiPrimary, 0.75),

    danger: isLight ? muiTheme.palette.error.dark : muiTheme.palette.error.light,
    dangerLight: isLight ? lighten(muiTheme.palette.error.light, .3) : darken(muiTheme.palette.error.dark, 0.3),

    neutral0: muiBackground,
    neutral5: shade(muiPrimary, 0.05),
    neutral10: shade(muiBackground, 0.1) , // option background
    neutral20: shade(muiPrimary, 0.2), // border and controls
    neutral30: shade(muiPrimary, 0.3), // border on hover
    neutral40: shade(muiPrimary, 0.4), // controls on hover
    neutral50: shade(muiPrimary, 0.5), // placeholder
    neutral60: shade(muiPrimary, 0.6), // control active
    neutral70: shade(muiPrimary, 0.7),
    neutral80: shade(muiBackground, 0.8), // option text & controls on focus+hover
    neutral90: shade(muiPrimary, 0.9),
  };
  givenTheme.spacing.baseUnit = 4;
  return givenTheme;
}
