/** File includes all helper methods for settings */
import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;

/**
 * create settings for given user
 * @param {string} userId ID of the user for whom settings are to be created
 * @param {function} callback function to be executed after settings are created, receives newly created settings
 */
export const createNewSettingsForUser = (userId, callback) => {
  console.log('creating new settings for user', userId);
  const newSettings = { userId: userId };
  axios.post(serverURL + '/settings/add/', newSettings)
       .then(res => {
         console.log('result of adding settings for ' + userId, res);
         if (callback) callback(res.data);
       }).catch(err => {console.log(err)});
}

/**
 * updates user data in Auth0 database
 * @param {string} userId id of the user whose data is to be changed
 * @param {Object} newData data to be changed (will not affect data that is not passed)
 * @param {function} callback function to be executed after updating (receives new updated data)
 */
export const updateUser = (userId, newData, callback) => {
  axios.put(serverURL + '/users/update/' + userId, newData)
       .then((result) => {
         console.log('updated user', result.data);
         if (callback) callback(result.data);
       }).catch(err => {console.log(err)});
}

/**
 * updates user metadata in Auth0 database
 * @param {string} userId id of the user whose metadata is to be changed
 * @param {Object} newMetadata metadata to be changed (will not affect attributes that is not passed)
 * @param {function} callback function to be executed after updating (receives new updated metadata)
 */
export const updateUserMetadata = (userId, newMetadata, callback) => {
  axios.put(serverURL + '/users/updateMetadata/' + userId, newMetadata)
       .then((result) => {
         console.log('updated user metadata', result.data);
         if (callback) callback(result.data);
       }).catch(err => {console.log(err)});
}

/**
 * get user data for specified user from Auth0 database
 * @param {string} userId   ID of user whose data shall be fetched from the database
 * @param {function} updateUser   function that receives the user data and will update the state of the calling component
 */
export const getUserById = (userId, updateUser) => {
  axios.get(serverURL + '/users/byId/' + userId)
       .then(res => {
         if (updateUser) updateUser(res.data);
       }).catch(err => {console.log(err)});
}

/**
 * get user settings for specified user from database
 * @param {string} userId   ID of user whose settings shall be fetched from the database
 * @param {function} updateSettings   function that receives the settings and will update the state of the calling component
 */
export const getSettingsOfUser = (userId, updateSettings) => {
  axios.get(serverURL + '/settings/ofUser/' + userId)
       .then(res => {
         const settingsFound = res.data;
         if (!settingsFound) {
           createNewSettingsForUser(userId, () => getSettingsOfUser(userId, updateSettings));
         } else {
           updateSettings(settingsFound);
         }
       }).catch(err => {console.log(err)});
}

/**
 * single function that can alter the individual settings of a user
 * @param {string} userId  ID of the user whose settings shall be updated
 * @param {string} key   key of the setting that is to be updated. currently one of: contacts, language, prefersDarkMode
 * @param {*} value   new value of the setting to be updated
 * @param {(function|boolean)} updateAllSettings  callback to allow fetching new settings (receives new updated setting for user)
 */
export const updateUserSettingsForCategory = (userId, key, value, updateAllSettings) => {
  axios.put(serverURL + '/settings/updateSingleUserSetting/' + userId, { key, value }).then((result) => {
    console.log('result from updateUser' + key, result);
    if (updateAllSettings) updateAllSettings(result.data.settingSaved);
  });
}

