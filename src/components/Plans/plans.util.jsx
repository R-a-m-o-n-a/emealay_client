/** File includes all helper methods for plans */
import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;

/**
 * Fetches all plans of the given user from the database and provides them as a parameter to the updatePlans function
 * @param {string} userId  ID of user whose plans shall be fetched from the database
 * @param {function} updatePlans  function that receives the plans and will update the state of the calling component
 * @public
 */
export const getPlansOfUser = (userId, updatePlans) => {
  axios.get(serverURL + '/plans/ofUser/' + userId)
       .then(res => {
         updatePlans(res.data);
       })
       .catch(err => {
         console.log(err.message);
       });
}

/**
 * Fetches a single plan by ID from the database and provides it as a parameter to the updatePlan function
 * @param {string} planId  ID of plan to be fetched from the database
 * @param {function} updatePlan  function that receives the plan and will update the state of the calling component
 */
export const getSinglePlan = (planId, updatePlan) => {
  axios.get(serverURL + '/plans/' + planId)
       .then(res => {
         updatePlan(res.data);
       })
       .catch(err => {
         console.log(err.message);
       });
}

/**
 * Add plan to database
 * @param {object} newPlan plan to be added
 * @param {function} callback
 */
export const addPlan = (newPlan, callback) => {
  axios.post(serverURL + '/plans/add', newPlan).then((result) => {
    console.log('add request sent', result.data);
    if (callback) callback(result.data.plan);
  });
}

/**
 * Toggles the checked attribute of an ingredient
 * Will also affect the plans gotEverything attribute (will be true if after execution all ingredients of the plan are checked)
 * @param {string} planId ID of the plan that the ingredient belongs to
 * @param {Object} ingredient the entire ingredient object (including name and checked attributes)
 * @param {function} callback function to executed after toggling checked attribute in database
 * @public
 */
export const checkOrUncheckIngredient = (planId, ingredient, callback) => {
  axios.put(serverURL + '/plans/checkOrUncheckIngredient/' + planId, ingredient).then(callback).catch(err => {
    console.log(err.message);
  });
}

/**
 * Gets an array of shape [{_id, numberOfPlans}] that contains for each user that has plans in the database the number of future(!) plans they have
 * @param {function} updatePlanCounts function that receives the array and will update the state of the calling component
 */
export const getNumberOfPlansOfUsers = (updatePlanCounts) => {
  axios.get(serverURL + '/plans/numberOfPlans/')
       .then(res => {
         updatePlanCounts(res.data);
       })
       .catch(err => {
         console.log(err.message);
       });
}
