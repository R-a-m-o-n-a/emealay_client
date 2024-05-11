import React, { useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Dialog, Tab, Tabs } from '@material-ui/core';
import Meals from "../Meals/Meals";
import Navbar from "../Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../Settings/settings.util";
import BackButton from "../Buttons/BackButton";
import { useTranslation } from "react-i18next";
import { LoadingBody } from "../Loading";
import Plans from "../Plans/Plans";
import { ContactAvatar, getContactName, getContactPicture } from "./social.util";
import { useTracking } from "react-tracking";

const useStyles = makeStyles((theme) => ({
  contactsContent: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    overflowY: "hidden",
  },
  swipeView: {
    height: `calc(100% - 2 * ${process.env.REACT_APP_NAV_TOP_HEIGHT}px)`,
    overflowY: 'auto',
  },
  dialogPicture: {
    maxHeight: '100%',
    maxWidth: '100%',
  },
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
  let { userId, tab } = useParams();
  let navigate = useNavigate();
  const { Track, trackEvent } = useTracking({ subpage: 'contact-content', contactId: userId });

  const [otherUser, setOtherUser] = React.useState(null);
  const [currentTab, setCurrentTab] = React.useState((tab === 'plans') ? 1 : 0);
  const [isContactProfileOpen, setIsContactProfileOpen] = React.useState(false);

  useEffect(() => {
    getUserById(userId, setOtherUser);
  }, [userId]);

  useEffect(() => {
    if (tab === 'meals') setCurrentTab(0);
    if (tab === 'plans') setCurrentTab(1);
  }, [tab]);

  const leftSideComponent = () => {
    if (!isLoading && isAuthenticated && user) {
      return <BackButton onClick={() => {navigate(-1);}} />;
    } else {
      return null;
    }
  }

  const switchTab = (newIndex) => {
    trackEvent({ event: 'switch-tab', to: newIndex === 1 ? 'plans' : 'meals' });
    setCurrentTab(newIndex);
  }

  const getTabs = () =>
    <Tabs value={currentTab} onChange={(event, newValue) => {switchTab(newValue);}} indicatorColor="secondary" textColor="secondary" variant="fullWidth">
      <Tab label={t('Meals')} />
      <Tab label={t('Plans')} />
    </Tabs>
  ;

  const openContactProfilePicture = () => {
    setIsContactProfileOpen(true);
  }
  return (
    <Track>
      <Box className={classes.contactsContent}>
        {otherUser ?
          <>
            <Navbar pageTitle={getContactName(otherUser)}
                    secondary
                    titleOnClick={openContactProfilePicture}
                    leftSideComponent={leftSideComponent()}
                    rightSideComponent={getContactPicture(otherUser) ?
                      <ContactAvatar src={getContactPicture(otherUser)} alt={getContactName(otherUser)} onClick={openContactProfilePicture} /> : null} />

            <Dialog open={isContactProfileOpen} onClose={() => setIsContactProfileOpen(false)}>
              <img src={getContactPicture(otherUser)} alt={getContactName(otherUser)} className={classes.dialogPicture} />
            </Dialog>

            {getTabs()}
            <SwipeableViews containerStyle={{ minHeight: '100%' }} style={{
              height: `calc(100% - 2 * ${process.env.REACT_APP_NAV_TOP_HEIGHT}px)`,
              overflowY: 'auto',
            }} axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={currentTab} onChangeIndex={switchTab}>
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
    </Track>
  );
}

export default ContactsContent;
