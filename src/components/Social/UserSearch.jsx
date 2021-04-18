import React, { useEffect, useState } from 'react';
import { Avatar, Box, Collapse, Divider, InputBase, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Toolbar, Typography } from '@material-ui/core';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { makeStyles } from '@material-ui/styles';
import Loading from "../Loading";
import { useTranslation } from "react-i18next";
import SimpleCloseX from "../Buttons/SimpleCloseX";
import { arrayOf, bool, func, shape } from "prop-types";
import FriendOrUnfriendButton from "./FriendOrUnfriendButton";
import { getContactName, getContactPicture } from "./social.util";

const useStyles = makeStyles(theme => ({
  userSearchBox: {
    position: "absolute",
    backgroundColor: theme.palette.background.default,
    zIndex: 1200,
    top: 0,
    left: 0,
    width: '100%',
    height: 'calc(100% - ' + process.env.REACT_APP_NAV_BOTTOM_HEIGHT + 'px)',
  },
  navBarTextInput: {
    backgroundColor: theme.palette.primary.main,
  },
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem 1rem",
    fontFamily: "Cookie",
    fontSize: "2rem",
  },
  topNav: props => ({
    height: props.height,
    minHeight: props.height,
    color: theme.palette.background.default,
    justifyContent: 'space-between',
    backgroundColor: props.secondary ? theme.palette.secondary.main : theme.palette.primary.main,
  }),
  rightSide: {
    display: 'flex',
    alignItems: 'center',
  },
  headline: {
    fontSize: '30px',
    lineHeight: '35px'
  },
  logo: {
    marginRight: '1rem',
  },
  flexdiv: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    color: theme.palette.background.default,
  },
  listItemText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    paddingRight: '0.5rem',
  },
  resultList: {
    height: 'calc(100% - ' + process.env.REACT_APP_NAV_BOTTOM_HEIGHT + 'px)',
  }
}));

const serverURL = process.env.REACT_APP_SERVER_URL;

/**
 * Allows searching for users and shows a list of users that correspond to the search term.
 * If search term is empty, displays a list of all users.
 * Furthermore, allows adding or removing found users to/from the contact list.
 */
const UserSearch = (props) => {
  const classes = useStyles();
  const { user } = useAuth0();
  const { t } = useTranslation();

  const [userList, setUserList] = useState([]);
  const [query, setQuery] = useState('');

  const { closeSearch, open, contacts, afterUpdateContacts, openContact } = props;

  const getUsers = () => {
    if (query) {
      axios.get(serverURL + '/users/fromQuery/' + query)
           .then(res => {
             console.log('result', res);
             let usersFound = res.data;
             usersFound = usersFound.filter(u => u.user_id !== user.sub);
             setUserList(usersFound);
           })
           .catch(err => {
             console.log(err.message);
           });
    } else {
      axios.get(serverURL + '/users/all/')
           .then(res => {
             console.log('result', res);
             let usersFound = res.data;
             usersFound = usersFound.filter(u => u.user_id !== user.sub);
             setUserList(usersFound);
           })
           .catch(err => {
             console.log(err.message);
           });
    }
  }

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, [query]);

  const getListItems = () => {
    return userList.map(u => {
      const userId = u.user_id;

      return (
        <Box key={userId}>
          <ListItem button onClick={() => {if (openContact) openContact(userId)}}>
            <ListItemAvatar>
              <Avatar alt={'profile picture of ' + getContactName(u)} src={getContactPicture(u)} />
            </ListItemAvatar>
            <ListItemText primary={getContactName(u)} primaryTypographyProps={{ className: classes.listItemText }} />
            <ListItemSecondaryAction>
              <FriendOrUnfriendButton otherUser={u} contacts={contacts} afterUpdateContacts={afterUpdateContacts} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </Box>
      );
    });
  }

  return (
    <Box className={classes.userSearchBox}>
      <Toolbar className={classes.topNav}>
        <Box className={classes.flexdiv}>
          <InputBase value={query} name="query" className={classes.searchInput} onChange={e => setQuery(e.target.value)} label="Query" autoFocus />
        </Box>
        <Box className={classes.rightSide}>
          <SimpleCloseX onClick={closeSearch} />
        </Box>
      </Toolbar>

      <Collapse in={open && userList} className={classes.resultList}>
        {userList.length === 0 ? <Typography className={classes.infoText}>{query ? t("No results") : ''} </Typography> :
          <List component="nav" className={classes.root} aria-label="u list">
            {getListItems()}
            <Box />
          </List>
        }
      </Collapse>
    </Box>
  );
}

UserSearch.propTypes = {
  /** function that closes Dialog / sets open to false */
  closeSearch: func.isRequired,
  /** is component visible? */
  open: bool.isRequired,
  /** contact array of current user */
  contacts: arrayOf(shape({})).isRequired,
  /** function to be executed after friend or unfriend action. *Must* update the contacts prop. */
  afterUpdateContacts: func.isRequired,
  /** function that will open the contact's page */
  openContact: func,
}

export default withAuthenticationRequired(UserSearch, {
  onRedirecting: () => <Loading />,
});

