import React, { lazy, useState } from 'react';
import { Box, Divider, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { makeStyles } from '@material-ui/styles';
import Loading from "../Loading";
import { array, arrayOf, func, instanceOf, shape, string } from "prop-types";
import FriendOrUnfriendButton from "./FriendOrUnfriendButton";
import { ContactAvatar, getContactCountry, getContactName, getContactPicture } from "./social.util";
import { useTheme } from "@material-ui/core/styles";
import { faClipboardList, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useTracking } from "react-tracking";

// Flag is a huge component (10MB unzipped, 1,24 after bundling and packing) so it must be lazy-loaded
const Flag = lazy(() => import('react-world-flags'));

const useStyles = makeStyles(theme => ({
  listItemText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  subLineBox: {
    color: theme.palette.text.secondary,
    paddingLeft: '1px',
  },
  subLineIcon: {
    margin: '0 7px 0 18px',
    fontSize: '1.1rem',
  },
  subLineText: {
    display: 'inline',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 'bold',
  },
}));

const CONTACT_START_PAGE = 'meals';

/**
 * displays list of given users, including their country, no. of meals, and no. of plans optionally with a button to add or remove them from the friend list
 */
const UserList = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const { trackEvent } = useTracking();

  const { userList, numberOfMealsByUser, numberOfPlansByUser, contacts, afterUpdateContacts, variant } = props;

  const [isUpdatingContactList, setIsUpdatingContactList] = useState(false);

  const openContact = (userId) => {
    trackEvent({ event: 'open-contact-content', contactId: userId });
    navigate(`contact/${userId}/${CONTACT_START_PAGE}`);
  }

  function numberOfMeals(u) {
    return numberOfMealsByUser.get(u.user_id) ?? 0;
  }

  function numberOfPlans(u) {
    return numberOfPlansByUser.get(u.user_id) ?? 0;
  }

  return userList.map(u => {
    const userId = u.user_id;
    return (
      <Box key={userId}>
        <ListItem button onClick={() => {if (openContact) openContact(userId)}}>
          <ListItemAvatar>
            <ContactAvatar alt={getContactName(u)} src={getContactPicture(u)} />
          </ListItemAvatar>
          <ListItemText primary={<Typography className={classes.listItemText}>{getContactName(u)}</Typography>} secondary={<span className={classes.subLineBox}>
            <Flag code={getContactCountry(u)} height={16} style={{ display: 'inline', width: 'auto', height: 'calc(0.75 * ' + theme.typography.body1.fontSize + ')' }} />
            <FontAwesomeIcon icon={faUtensils} className={classes.subLineIcon} />
            <span className={classes.subLineText}>{numberOfMeals(u)}</span>
            <FontAwesomeIcon icon={faClipboardList} className={classes.subLineIcon} />
            <span className={classes.subLineText}>{numberOfPlans(u)}</span>
          </span>} />

          {variant !== 'userContacts' && <ListItemSecondaryAction>
            <FriendOrUnfriendButton otherUser={u}
                                    contacts={contacts}
                                    afterUpdateContacts={afterUpdateContacts}
                                    isSaving={isUpdatingContactList}
                                    setIsSaving={setIsUpdatingContactList} />
          </ListItemSecondaryAction>}
        </ListItem>
        <Divider />
      </Box>
    );
  });

}

UserList.propTypes = {
  /** list of all users */
  userList: array.isRequired,
  /** Map (key: userId, value: number of meals */
  numberOfMealsByUser: instanceOf(Map).isRequired,
  /** Map (key: userId, value: number of plans */
  numberOfPlansByUser: instanceOf(Map).isRequired,
  /** contact array of current user */
  contacts: arrayOf(shape({})).isRequired,
  /** function to be executed after friend or unfriend action. *Must* update the contacts prop. */
  afterUpdateContacts: func.isRequired,
  /** which layout to use (userContacts or with FriendOrUnfriendButtin) */
  variant: string,
}

export default withAuthenticationRequired(UserList, {
  onRedirecting: () => <Loading />,
});

