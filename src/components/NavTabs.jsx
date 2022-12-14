import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faCog, faUserFriends, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/styles';
import { Link, useRouteMatch } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  bottomNav: {
    height: process.env.REACT_APP_NAV_BOTTOM_HEIGHT + 'px',
    position: 'fixed',
    bottom: 0,
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    width: '100%',
  },
  bottomNavAction: {
    paddingTop: '8px',
    minWidth: "auto",
    alignItems: "flex-start",
  }
});

/** Bottom Navigation in the form of Tabs */
const NavTabs = (props) => {
  const classes = useStyles(props);
  const { t } = useTranslation();

  let activeTab = null;
  if (useRouteMatch('/meals')) activeTab = 'meals';
  if (useRouteMatch('/plans')) activeTab = 'plans';
  if (useRouteMatch('/social')) activeTab = 'social';
  if (useRouteMatch('/settings')) activeTab = 'settings';

  return (
    <>
      <BottomNavigation className={classes.bottomNav} value={activeTab} showLabels>
        <BottomNavigationAction className={classes.bottomNavAction}
                                component={Link}
                                to="/meals"
                                label={t('Meals')}
                                value="meals"
                                icon={<FontAwesomeIcon icon={faUtensils} color="primary" />} />
        <BottomNavigationAction className={classes.bottomNavAction}
                                component={Link}
                                to="/plans"
                                label={t('Plans')}
                                value="plans"
                                icon={<FontAwesomeIcon icon={faClipboardList} color="primary" />} />
        <BottomNavigationAction className={classes.bottomNavAction}
                                component={Link}
                                to="/social"
                                label={t('Social')}
                                value="social"
                                icon={<FontAwesomeIcon icon={faUserFriends} color="primary" />} />
        <BottomNavigationAction className={classes.bottomNavAction}
                                component={Link}
                                to="/settings"
                                label={t('Settings')}
                                value="settings"
                                icon={<FontAwesomeIcon icon={faCog} color="primary" />} />
      </BottomNavigation>
    </>
  );
}
export default NavTabs;

