/** File includes all helper methods for meals */
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { getSettingsOfUser } from "../Settings/settings.util";

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
