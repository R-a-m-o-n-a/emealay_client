/** File includes all helper methods for social */
import axios from "axios";
import { getSettingsOfUser, updateUserSettingsForCategory } from "../Settings/settings.util";
import { Avatar } from "@material-ui/core";
import React from "react";

const serverURL = process.env.REACT_APP_SERVER_URL;

/**
 * Fetches contacts of the given user from the database and provides them as a parameter to the updateContacts function
 * @param {string} userId  ID of user whose contacts shall be fetched from the database
 * @param {function} updateContacts  function that receives the contacts and will update the state of the calling component
 */
export const fetchContactsOfUser = (userId, updateContacts) => {
  getSettingsOfUser(userId, (settingsFound) => {
    const sortedContacts = settingsFound.contacts.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1)
    updateContacts(sortedContacts);
  });
}

/**
 * Updates all user contacts to represent the current data of the Auth0 database in case someone has changed their username or picture
 * @param {String} userId
 * @param {[String]} contactIDs
 * @param {function} updateContacts
 */
export const updateContactsFromAuth0 = (userId, contactIDs, updateContacts) => {
  if (userId && contactIDs && contactIDs.length > 0) {
    axios.get(serverURL + '/users/all')
         .then(res => {
           const usersFound = res.data;
           const contactsOfUser = usersFound.filter(u => contactIDs.includes(u.user_id));
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
      const sortedContacts = settings.contacts.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
      updateContacts(sortedContacts);
    });
  }
}

// wrap Avatar with the attribute refferer-policy to be applied to the img tag to avoid 403 error when accessing google profile pictures
export const ContactAvatar = ({ children, ...props }) => {
  return (
    <Avatar imgProps={{ referrerPolicy: "no-referrer" }} {...props}>
      {children}
    </Avatar>
  );
};

export const getContactName = (contact) => (contact?.user_metadata?.username ?? contact.name);
export const getContactPicture = (contact) => (contact?.user_metadata?.picture ?? contact.picture);
export const getContactCountry = (contact) => (contact?.user_metadata?.countryCode?.toLowerCase());

