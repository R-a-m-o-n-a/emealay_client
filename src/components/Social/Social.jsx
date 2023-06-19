import React, { useEffect, useState } from 'react';
import { List, Typography } from '@material-ui/core';
import Navbar from "../Navbar";
import SearchButton from "../Buttons/SearchButton";
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from '@material-ui/styles';
import UserSearch from "./UserSearch";
import { useTranslation } from "react-i18next";
import { fetchContactsOfUser, updateContactsFromAuth0 } from "./social.util";
import { withLoginRequired } from "../util";
import UserList from "./UserList";
import { getNumberOfMealsOfUsers } from "../Meals/meals.util";
import { getNumberOfPlansOfUsers } from "../Plans/plans.util";
import { useMap } from "../util/useMap";

const useStyles = makeStyles({
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem",
    fontFamily: "Cookie",
    fontSize: "1.3rem",
    lineHeight: "1.4rem",
  },
});

/**
 * Main contacts page. Displays a list of current user's contacts and allows searching for all users through Button in Navbar.
 *
 * On clicking on a contact's name will open ContactContent */
const Social = () => {
  const classes = useStyles();
  const { user } = useAuth0();
  const { t } = useTranslation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [noContactsFound, setNoContactsFound] = useState(false);
  const [numberOfMealsByUser, addToNumberOfMealsByUser] = useMap();
  const [numberOfPlansByUser, addToNumberOfPlansByUser] = useMap();

  // get and store information on how many meals and plans users have on first render
  useEffect(() => {
    // get how many meals each user has
    getNumberOfMealsOfUsers((mealCountArray) => {
      mealCountArray.forEach(mealCount => {
        addToNumberOfMealsByUser(mealCount._id, mealCount.numberOfMeals);
      });
    });

    // get how many plans each user has
    getNumberOfPlansOfUsers((planCountArray) => {
      planCountArray.forEach(planCount => {
        addToNumberOfPlansByUser(planCount._id, planCount.numberOfPlans);
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchContacts = (shouldUpdateContactsData = false) => { // at the first render, update contacts once from database, all the subsequent times not.
    if (user) {
      const userId = user.sub;
      fetchContactsOfUser(userId, (contactsFound) => {
        setContacts(contactsFound);
        if (contactsFound.length === 0) {
          setNoContactsFound(true);
        } else if (shouldUpdateContactsData === true) updateContactsFromAuth0(userId, contactsFound.map(c => c.user_id), setContacts);
      });
    }
  }

  useEffect(() => {
    fetchContacts(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {searchOpen ? <UserSearch open={searchOpen}
                                closeSearch={() => {setSearchOpen(false)}}
                                contacts={contacts}
                                afterUpdateContacts={fetchContacts}
                                numberOfMealsByUser={numberOfMealsByUser}
                                numberOfPlansByUser={numberOfPlansByUser} />
        : <Navbar pageTitle={t('Contacts')} rightSideComponent={<SearchButton onClick={() => {setSearchOpen(true)}} />} />}

      {contacts.length === 0
        ? <Typography className={classes.infoText}>
          {noContactsFound
            ? <>{t("No contacts yet")}<br />{t("Search for friends in the top right corner")}</>
            : t('Loading') + '...'}
        </Typography>
        : <List component="nav" aria-label="meal list">
          <UserList variant="userContacts"
                    userList={contacts}
                    contacts={contacts}
                    numberOfMealsByUser={numberOfMealsByUser}
                    numberOfPlansByUser={numberOfPlansByUser}
                    afterUpdateContacts={fetchContacts} />
        </List>
      }
    </>
  );
}

export default withLoginRequired(Social);
