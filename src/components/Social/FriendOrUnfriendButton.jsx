import React, { useEffect, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading";
import { IconButton } from "@material-ui/core";
import { PersonAdd, PersonAddDisabled } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { array, bool, func, object } from "prop-types";
import { fetchContactsOfUser, updateUserContacts } from "./social.util";

const useStyles = makeStyles(theme => ({
  iconButtonInCircle: {
    padding: '8px',
    marginRight: '-8px',
    borderRadius: '100%',
    backgroundColor: theme.palette.background.default,

    '&:hover': {
      backgroundColor: theme.palette.background.default,
    }
  },
  addFriend: {
    color: theme.palette.primary.main,
  },
  removeFriend: {
    color: theme.palette.error.main,
  },
}));

/** Button that will toggle whether given contact is included in current user's contacts array. */
const FriendOrUnfriendButton = (props) => {
  const classes = useStyles();
  const { otherUser, afterUpdateContacts, contacts: givenContacts } = props;
  const { user } = useAuth0();

  const [contacts, setContacts] = useState(givenContacts);
  const [isContact, setIsContact] = useState(false);
  const [checkedIsContact, setCheckedIsContact] = useState(!!givenContacts);

  const updateContacts = (newContacts) => {
    if (user) {
      updateUserContacts(user.sub, newContacts, (updatedContacts) => {
        if (afterUpdateContacts) afterUpdateContacts(updatedContacts);
        setContacts(updatedContacts);
      });
    }
  }

  const fetchContacts = () => {
    if (user) {
      const userId = user.sub;
      fetchContactsOfUser(userId, setContacts);
    }
  }

  useEffect(() => {
    if (!givenContacts) fetchContacts();
  }, [user]); // eslint-disable-line

  useEffect(() => {
    setCheckedIsContact(false);
    console.log('rechecking', otherUser.name, contacts.map(m => m.name));
    if (contacts && user) {
      setIsContact(contacts.some(c => c.user_id === otherUser.user_id));
      setCheckedIsContact(true);
    }
  }, [user, contacts]); // eslint-disable-line

  const addFriend = () => {
    const newFriends = contacts;
    newFriends.push(otherUser);
    updateContacts(newFriends);
  }

  const removeFriend = () => {
    const newFriends = contacts.filter(u => u.user_id !== otherUser.user_id);
    updateContacts(newFriends);
  }

  if (!checkedIsContact) return null;

  return (
    <IconButton edge="end" className={(props.inCircle) ? classes.iconButtonInCircle : ''} onClick={() => isContact ? removeFriend() : addFriend()}>
      {isContact
        ? <PersonAddDisabled className={classes.removeFriend} />
        : <PersonAdd className={classes.addFriend} />}
    </IconButton>
  );
}

FriendOrUnfriendButton.propTypes = {
  /** user that will be added or removed to contacts array of current user */
  otherUser: object.isRequired,
  /** optional function that allows fetching updated contacts in parent component (receives no parameters) */
  afterUpdateContacts: func,
  /** current user's contacts that the otherUser will be added to or removed from. If not provided, will fetch contacts from the database, but this will result in longer loading */
  contacts: array,
  /** optional styling that displays button in a white circle */
  inCircle: bool,
}

FriendOrUnfriendButton.defaultProps = {
  afterUpdateContacts: null,
  contacts: null,
  inCircle: false,
}

export default withAuthenticationRequired(FriendOrUnfriendButton, {
  onRedirecting: () => <Loading />,
});
