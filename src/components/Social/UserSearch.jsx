import React, { useEffect, useState } from 'react';
import { AppBar, Box, Collapse, InputBase, List, Toolbar, Typography } from '@material-ui/core';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { makeStyles } from '@material-ui/styles';
import Loading, { LoadingBody } from "../Loading";
import { useTranslation } from "react-i18next";
import SimpleCloseX from "../Buttons/SimpleCloseX";
import { arrayOf, bool, func, instanceOf, shape } from "prop-types";
import UserList from "./UserList";
import { useLocation, useNavigate } from "react-router-dom";

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
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem",
    fontFamily: "Cookie",
    fontSize: "1.3rem",
    lineHeight: "1.4rem",
  },
  topNav: props => ({
    height: process.env.REACT_APP_NAV_TOP_HEIGHT + 'px',
    minHeight: process.env.REACT_APP_NAV_TOP_HEIGHT + 'px',
    color: theme.palette.background.default,
    justifyContent: 'space-between',
    backgroundColor: props.secondary ? theme.palette.secondary.main : theme.palette.primary.main,
  }),
  rightSide: {
    display: 'flex',
    alignItems: 'center',
  },
  flexdiv: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    color: theme.palette.background.default,
  },
  resultListCollapse: {
    height: 'calc(100vh - ' + process.env.REACT_APP_NAV_BOTTOM_HEIGHT + 'px - ' + process.env.REACT_APP_NAV_TOP_HEIGHT + 'px)',

    '& .MuiCollapse-wrapper, MuiCollapse-wrapperInner': {
      maxHeight: '100%',
    },
  },
  resultList: {
    maxHeight: '100%',
    overflow: "auto",
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
  let navigate = useNavigate();
  const { state, pathname } = useLocation();

  const { numberOfMealsByUser, numberOfPlansByUser, closeSearch, open, contacts, afterUpdateContacts } = props;

  const [userList, setUserList] = useState(state?.userList ?? undefined);
  const [query, setQuery] = useState(state?.query ?? '');

  const getUsers = () => {
    if(query && (!state?.query || query !== state?.query)) setUserList(undefined);
    const request = query ? '/users/fromQuery/' + query : '/users/all/';
    axios.get(serverURL + request)
         .then(res => {
           let usersFound = res.data;
           usersFound = usersFound.filter(u => u.user_id !== user.sub);
           usersFound.sort(orderByNoOfMealsDesc);
           setUserList(usersFound);
           navigate(pathname, { replace: true, state: { ...state, query: query, userList: usersFound } });
         })
         .catch(err => {
           console.log(err.message);
         });
  }

  function orderByNoOfMealsDesc(a, b) {
    const mealsOfA = numberOfMealsByUser.get(a.user_id) ?? 0;
    const mealsOfB = numberOfMealsByUser.get(b.user_id) ?? 0;
    const plansOfA = numberOfPlansByUser.get(a.user_id) ?? 0;
    const plansOfB = numberOfPlansByUser.get(b.user_id) ?? 0;
    if (mealsOfB - mealsOfA !== 0) return mealsOfB - mealsOfA;
    if (plansOfB - plansOfA !== 0) return plansOfB - plansOfA;
    return a.user_id - b.user_id;
  }

  if (userList) userList.sort(orderByNoOfMealsDesc);

  useEffect(() => {
    getUsers();
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box className={classes.userSearchBox}>
        <AppBar position="sticky" style={{ maxWidth: '100%' }}>
          <Toolbar className={classes.topNav} variant="dense">
            <Box className={classes.flexdiv}>
              <InputBase placeholder={t('Search for users')}
                         value={query}
                         name="query"
                         className={classes.searchInput}
                         onChange={e => setQuery(e.target.value)}
                         label="Query"
                         autoFocus />
            </Box>
            <Box className={classes.rightSide}>
              <SimpleCloseX onClick={closeSearch} />
            </Box>
          </Toolbar>
        </AppBar>
        <Collapse in={open} className={classes.resultListCollapse}>
          {userList === undefined ? <LoadingBody /> :
            (userList.length === 0 ? <Typography className={classes.infoText}>{t("No results")}</Typography> :
                <List component="nav" aria-label="u list" className={classes.resultList}>
                  <UserList userList={userList}
                            numberOfMealsByUser={numberOfMealsByUser}
                            numberOfPlansByUser={numberOfPlansByUser}
                            contacts={contacts}
                            afterUpdateContacts={afterUpdateContacts} />
                  <Box />
                </List>
            )}
        </Collapse>
      </Box>
    </>
  );
}

UserSearch.propTypes = {
  /** Map (key: userId, value: number of meals */
  numberOfMealsByUser: instanceOf(Map).isRequired,
  /** Map (key: userId, value: number of plans */
  numberOfPlansByUser: instanceOf(Map).isRequired,
  /** function that closes Dialog / sets open to false */
  closeSearch: func.isRequired,
  /** is component visible? */
  open: bool.isRequired,
  /** contact array of current user */
  contacts: arrayOf(shape({})).isRequired,
  /** function to be executed after friend or unfriend action. *Must* update the contacts prop. */
  afterUpdateContacts: func.isRequired,
}

export default withAuthenticationRequired(UserSearch, {
  onRedirecting: () => <Loading />,
});

