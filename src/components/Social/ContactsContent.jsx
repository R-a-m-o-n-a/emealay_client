import React, { useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Dialog, Tab, Tabs } from '@material-ui/core';
import Meals from "../Meals/Meals";
import Navbar from "../Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory, useParams } from "react-router-dom";
import { getSettingsOfUser, getUserById } from "../Settings/settings.util";
import BackButton from "../Buttons/BackButton";
import { useTranslation } from "react-i18next";
import { LoadingBody } from "../Loading";
import Plans from "../Plans/Plans";
import { getContactName, getContactPicture } from "./social.util";

const useStyles = makeStyles((theme) => ({
  contactsContent: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    overflowY: "hidden",
  },
  swipeView: {
    height: `calc(100% - ${process.env.REACT_APP_NAV_BOTTOM_HEIGHT}px)`,
  }
}));

/**
 * #### Page component that is displayed when other users are accessing a profile that is not their own.
 * + gets the userId from the URL params (of React Router)
 * + current content:
 *     + Navbar (title: other user's name)
 *     + two swipeable tabs that display the other user's plans and meals
 */
const ContactsContent = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth0();
  let { userId } = useParams();
  let history = useHistory();

  const [otherUser, setOtherUser] = React.useState(null);
  const [currentTab, setCurrentTab] = React.useState(1);
  const [isContactProfileOpen, setIsContactProfileOpen] = React.useState(false);

  useEffect(() => {
    getUserById(userId, setOtherUser);
  }, [userId]);

  useEffect(() => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        setCurrentTab(settings.contactStartPageIndex || 1);
      });
    }
  }, [user]);

  const leftSideComponent = () => {
    if (!isLoading && isAuthenticated && user) {
      return <BackButton onClick={() => {history.goBack();}} />;
    } else {
      return null;
    }
  }

  const getTabs = () =>
    <Tabs value={currentTab} onChange={(event, newValue) => {setCurrentTab(newValue);}} indicatorColor="secondary" textColor="secondary" variant="fullWidth">
      <Tab label={t('Meals')} />
      <Tab label={t('Plans')} />
    </Tabs>
  ;

  return (
    <Box className={classes.contactsContent}>
      {otherUser ?
        <>
          <Navbar pageTitle={getContactName(otherUser)} secondary titleOnClick={() => {setIsContactProfileOpen(true);}} leftSideComponent={leftSideComponent()} />

          <Dialog open={isContactProfileOpen} onClose={() => setIsContactProfileOpen(false)}>
            <img src={getContactPicture(otherUser)} alt={getContactName(otherUser)} />
          </Dialog>

          {getTabs()}
          <SwipeableViews style={{height: '100%'}} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={currentTab} onChangeIndex={setCurrentTab}>
            <Box role="tabpanel" hidden={currentTab !== 0} dir={theme.direction}>
              <Meals own={false} userId={otherUser.user_id} />
            </Box>
            <Box role="tabpanel" hidden={currentTab !== 1} dir={theme.direction}>
              <Plans own={false} userId={otherUser.user_id} />
            </Box>
          </SwipeableViews>
        </> : <>
          <Navbar pageTitle={t('Contacts')} leftSideComponent={leftSideComponent()} />
          {getTabs()}
          <LoadingBody />
        </>
      }
    </Box>
  );
}

export default ContactsContent;
