import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faCog, faUserFriends, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/styles';
import { Link, useLocation, useMatch } from 'react-router-dom';
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
    paddingTop: '15px',
    // minWidth: "auto",
    width: '25%',
    alignItems: "flex-start",

    '& .MuiBottomNavigationAction-label': {
      fontSize: '0.9rem',
      paddingTop: '2px',

      '&.Mui-selected': {
        fontSize: '0.95rem',
        fontWeight: 'bold',
      }
    },
    '&.MuiBottomNavigationAction-root': {
      fontSize: '1.1rem',

      '&.Mui-selected': {
        fontSize: '1.3rem',
        paddingTop: '13px',
      }
    }
  }
});

/** Bottom Navigation in the form of Tabs */
const NavTabs = (props) => {
  const classes = useStyles(props);
  const { t } = useTranslation();
  const { state } = useLocation();

  let activeTab = null;
  if (useMatch('/meals/*')) {
    if (state && (state.mealContext === 'social' || state.mealContext === 'plans')) {
      activeTab = state.mealContext;
    } else {
      activeTab = 'meals';
    }
  }
  if (useMatch('/plans/*')) activeTab = 'plans';
  if (useMatch('/social/*')) activeTab = 'social';
  if (useMatch('/settings/*')) activeTab = 'settings';

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

