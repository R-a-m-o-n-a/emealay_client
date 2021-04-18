import React, { useEffect, useState } from 'react';
import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import Navbar from "../Navbar";
import SearchButton from "../Buttons/SearchButton";
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from '@material-ui/styles';
import UserSearch from "./UserSearch";
import { useTranslation } from "react-i18next";
import { fetchContactsOfUser, getContactName, getContactPicture } from "./social.util";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import ContactsContent from "./ContactsContent";
import { withLoginRequired } from "../util";

const useStyles = makeStyles({
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem 1rem",
    fontFamily: "Cookie",
    fontSize: "2rem",
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

  const fetchContacts = () => {
    if (user) {
      const userId = user.sub;
      fetchContactsOfUser(userId, (contactsFound) => {
        setContacts(contactsFound);
        if (contactsFound.length === 0) setNoContactsFound(true);
      });
    }
  }

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line
  }, [])

  const showUser = (userId) => {
    history.push(`${url}/contact/${userId}`);
  }

  console.log(contacts);

  const getListItems = () => {
    return contacts.map(contact => {
      console.log('Contact', contact);
      const userId = contact.user_id;

      return (
        <Box key={userId}>
          <ListItem button onClick={() => {history.push(`${url}/contact/${userId}`);}}>
            <ListItemAvatar>
              <Avatar src={getContactPicture(contact)} alt={'profile picture of ' + getContactName(contact)} />
            </ListItemAvatar>
            <ListItemText primary={getContactName(contact)} primaryTypographyProps={{ className: classes.listItemText }} />
          </ListItem>
          <Divider />
        </Box>
      );
    });
  }

  console.log(url, path);

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
        <Route path={`${path}/contact/:userId`}>
          <ContactsContent />
        </Route>
      </Switch>
    </>
  )
    ;
}

export default withLoginRequired(Social);
