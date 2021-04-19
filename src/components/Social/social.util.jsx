/** File includes all helper methods for social */
import axios from "axios";
import { createNewSettingsForUser, updateUserSettingsForCategory } from "../Settings/settings.util";

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

/**
 * Updates all user contacts to represent the current data of the Auth0 database in case someone has changed their nickname or picture
 * @param {String} userId
 * @param {[String]} contactIDs
 * @param {function} updateContacts
 */
export const updateContactsFromAuth0 = (userId, contactIDs, updateContacts) => {
  if (userId && contactIDs && contactIDs.length > 0) {
    axios.get(serverURL + '/users/all')
         .then(res => {
           const usersFound = res.data;
           console.log('usersFound', usersFound);
           const contactsOfUser = usersFound.filter(u => contactIDs.includes(u.user_id));
           console.log('usersFiltered', contactsOfUser);
           updateContacts(contactsOfUser);
           updateUserContacts(userId, contactsOfUser, updateContacts);
         }).catch(err => {console.log(err)});
  }
}

/**
 * Update user contacts in settings collection
 * @param {String} userId userId of user whose contacts are to be updated
 * @param {*} newContacts contacts to put into the database
 * @param {function} updateContacts callback that gets new updated contacts as parameter
 */
export const updateUserContacts = (userId, newContacts, updateContacts) => {
  if (userId) {
    updateUserSettingsForCategory(userId, 'contacts', newContacts, (settings) => {
      const sortedContacts = settings.contacts.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1)
      updateContacts(sortedContacts);
    });
  }
}

export const getContactName = (contact) => (contact.user_metadata && contact.user_metadata.nickname) ? contact.user_metadata.nickname : contact.name;
export const getContactPicture = (contact) => (contact.user_metadata && contact.user_metadata.picture) ? contact.user_metadata.picture : contact.picture;
