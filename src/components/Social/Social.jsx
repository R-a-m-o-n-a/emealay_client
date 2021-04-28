import React, { useEffect, useState } from 'react';
import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import Navbar from "../Navbar";
import SearchButton from "../Buttons/SearchButton";
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from '@material-ui/styles';
import UserSearch from "./UserSearch";
import { useTranslation } from "react-i18next";
import { fetchContactsOfUser, getContactName, getContactPicture, updateContactsFromAuth0 } from "./social.util";
import { Route, Switch, Redirect, useHistory, useRouteMatch } from "react-router-dom";
import ContactsContent from "./ContactsContent";
import { withLoginRequired } from "../util";
import { getSettingsOfUser } from "../Settings/settings.util";

const useStyles = makeStyles({
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem",
    fontFamily: "Cookie",
    fontSize: "1.5rem",
    lineHeight: "1.6rem",
  },
});

/**
 * displays a list of current user's contacts and allows searching for all users through Button in Navbar
 * on clicking on a contact's name will open ContactContent */
const Social = () => {
  const classes = useStyles();
  const { user } = useAuth0();
  const { t } = useTranslation();
  let { path, url } = useRouteMatch();
  let history = useHistory();

  const [searchOpen, setSearchOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [noContactsFound, setNoContactsFound] = useState(false);
  const [contactStartPage, setContactStartPage] = useState('plans');

  const fetchContacts = (updateContactsData = false) => {
    if (user) {
      const userId = user.sub;
      fetchContactsOfUser(userId, (contactsFound) => {
        setContacts(contactsFound);
        if (contactsFound.length === 0) {
          setNoContactsFound(true);
        } else if (updateContactsData) updateContactsFromAuth0(userId, contactsFound.map(c => c.user_id), setContacts);
      });
    }
  }

  useEffect(() => {
    fetchContacts(true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        console.log(settings, settings.contactStartPageIndex);
        setContactStartPage(settings.contactStartPageIndex === 0 ? 'meals' : 'plans');
      });
    }
  }, [user]);

  const showUser = (userId) => {
    history.push(`${url}/contact/${userId}/${contactStartPage}`);
  }

  const getListItems = () => {
    return contacts.map(contact => {
      const userId = contact.user_id;

      return (
        <Box key={userId}>
          <ListItem button onClick={() => {history.push(`${url}/contact/${userId}`);}}>
            <ListItemAvatar>
              <Avatar src={getContactPicture(contact)} alt={getContactName(contact)} />
            </ListItemAvatar>
            <ListItemText primary={getContactName(contact)} primaryTypographyProps={{ className: classes.listItemText }} />
          </ListItem>
          <Divider />
        </Box>
      );
    });
  }

  return (
    <>
      <Switch>
        <Route exact path={path}>
          {searchOpen ? <UserSearch open={searchOpen} closeSearch={() => {setSearchOpen(false)}} contacts={contacts} afterUpdateContacts={fetchContacts} openContact={showUser} />
            : <Navbar pageTitle={t('Contacts')} rightSideComponent={<SearchButton onClick={() => {setSearchOpen(true)}} />} />}

          {contacts.length === 0
            ? <Typography className={classes.infoText}>
              {noContactsFound
                ? <>{t("No contacts yet")}<br />{t("Search for friends in the top right corner")}</>
                : t('Loading') + '...'}
            </Typography>
            : <List component="nav" className={classes.root} aria-label="meal list">
              {getListItems()}
            </List>
          }
        </Route>
        <Redirect exact from={`${path}/contact/:userId`} to={`${path}/contact/:userId/${contactStartPage}`} />
        <Route path={`${path}/contact/:userId/:tab`}>
          <ContactsContent />
        </Route>
      </Switch>
    </>
  );
}

export default withLoginRequired(Social);
