/** File includes all helper methods for social */
import axios from "axios";
import { createNewSettingsForUser } from "../Settings/settings.util";

const serverURL = process.env.REACT_APP_SERVER_URL;

/**
 * Fetches contacts of the given user from the database and provides them as a parameter to the updateContacts function
 * @param {string} userId  ID of user whose contacts shall be fetched from the database
 * @param {function} updateContacts  function that receives the contacts and will update the state of the calling component
 */
export const fetchContactsOfUser = (userId, updateContacts) => {
  axios.get(serverURL + '/settings/ofUser/' + userId)
       .then(res => {
         const settingsFound = res.data;
         if (!settingsFound) {
           createNewSettingsForUser(userId, fetchContactsOfUser(userId, updateContacts));
         } else {
           const sortedContacts = settingsFound.contacts.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1)
           updateContacts(sortedContacts);
         }
       }).catch(err => {console.log(err)});
}

export const getContactName = (contact) => (contact.user_metadata && contact.user_metadata.nickname) ? contact.user_metadata.nickname : contact.name;
export const getContactPicture = (contact) => (contact.user_metadata && contact.user_metadata.picture) ? contact.user_metadata.picture : contact.picture;
