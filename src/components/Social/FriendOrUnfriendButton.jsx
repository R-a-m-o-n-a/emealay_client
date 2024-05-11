import React, { useMemo, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading";
import { CircularProgress, IconButton } from "@material-ui/core";
import { PersonAdd, PersonAddDisabled } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { array, bool, func, object } from "prop-types";
import { updateUserContacts } from "./social.util";
import { useTracking } from "react-tracking";

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
  loadingCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-12px',
    marginLeft: '-12px',
  }
}));

/** Button that will toggle whether given contact is included in current user's contacts array. */
const FriendOrUnfriendButton = (props) => {
  const classes = useStyles();
  const { otherUser, afterUpdateContacts, contacts: givenContacts, isSaving: isSavingSomething, setIsSaving: setIsSavingInParentComponent } = props;
  const { user } = useAuth0();
  const { trackEvent } = useTracking({ module: 'friend-button', otherUserId: otherUser?.user_id });

  const [isSavingThisOne, setIsSavingThisOne] = useState(false);

  const updateContacts = (newContacts) => {
    if (user && !isSavingSomething && !isSavingThisOne) {
      setIsSaving(true);
      updateUserContacts(user.sub, newContacts, (updatedContacts) => {
        setIsSaving(false);
        if (afterUpdateContacts) afterUpdateContacts(updatedContacts);
      });
    }
  }

  const setIsSaving = (value) => {
    setIsSavingThisOne(value);
    if (setIsSavingInParentComponent) setIsSavingInParentComponent(value);
  };

  // is the other user in the contacts array?
  const isContact = useMemo(() => {
    if (givenContacts && user) {
      return givenContacts.some(c => c.user_id === otherUser.user_id);
    } else {
      return undefined;
    }
  }, [user, givenContacts, otherUser]);

  const addFriend = () => {
    trackEvent({ event: 'add-friend' });
    const newFriends = Array.from(givenContacts);
    newFriends.push(otherUser);
    updateContacts(newFriends);
  }

  const removeFriend = () => {
    trackEvent({ event: 'remove-friend' });
    const newFriends = givenContacts.filter(u => u.user_id !== otherUser.user_id);
    updateContacts(newFriends);
  }

  return (
    <IconButton disabled={isContact === undefined || isSavingSomething || isSavingThisOne}
                edge="end"
                className={(props.inCircle) ? classes.iconButtonInCircle : ''}
                onClick={() => (isContact && !isSavingSomething) ? removeFriend() : addFriend()}>
      {isContact
        ? <PersonAddDisabled color={isSavingSomething || isSavingThisOne ? "disabled" : "error"} />
        : <PersonAdd color={isSavingSomething || isSavingThisOne ? "disabled" : "primary"} />}
      {isSavingThisOne && (
        <CircularProgress size={24} color="inherit" className={classes.loadingCircle} />
      )}
    </IconButton>
  );
}

FriendOrUnfriendButton.propTypes = {
  /** user that will be added or removed to contacts array of current user */
  otherUser: object.isRequired,
  /** optional function that allows fetching updated contacts in parent component (receives no parameters) */
  afterUpdateContacts: func,
  /** current user's contacts that the otherUser will be added to or removed from. */
  contacts: array.isRequired,
  /** optional styling that displays button in a white circle */
  inCircle: bool,
  /** optional styling that displays button in a white circle */
  isSaving: bool,
  /** function to change isSaving in parent component */
  setIsSaving: func,
}

FriendOrUnfriendButton.defaultProps = {
  afterUpdateContacts: null,
  inCircle: false,
  isSaving: false,
  setIsSaving: undefined,
}

export default withAuthenticationRequired(FriendOrUnfriendButton, {
  onRedirecting: () => <Loading />,
});
