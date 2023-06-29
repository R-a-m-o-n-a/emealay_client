import React, { lazy, useEffect, useMemo, useState } from 'react';
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import Profile from "./Profile";
import { Box, InputBase, MenuItem, Select, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { useAuth0 } from "@auth0/auth0-react";
import { getSettingsOfUser, getUserById, updateUserMetadata, updateUserSettingsForCategory } from "./settings.util";
import { makeStyles } from "@material-ui/styles";
import { allLanguages } from "../../i18n";
import { muiTableBorder, withLoginRequired } from "../util";
import LogoutButton from "../Buttons/LogoutButton";
import EditButton from "../Buttons/EditButton";
import ProfilePlaceholder from "./ProfilePlaceholder";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowForwardIos } from "@material-ui/icons";
import SupportButton from "../Buttons/SupportButton";
import importedCountryList from 'react-select-country-list';

// Flag is a huge component (10MB unzipped, 1,24 after bundling and packing) so it must be lazy-loaded
const Flag = lazy(() => import('react-world-flags'));

const useStyles = makeStyles(theme => ({
  settings: {
    padding: '1rem 0',
    maxHeight: `calc(100% - ${process.env.REACT_APP_NAV_TOP_HEIGHT}px)`,
    overflowY: 'auto',
  },
  table: {
    borderTop: muiTableBorder(theme),
    margin: '0',
    overflowY: "visible",
  },
  tableCell: {
    padding: '10px',
    '&:first-child': {
      width: '25%',
    }
  },
  buttonTableCell: {
    padding: '15px',
    cursor: 'pointer',
  },
  tableCellButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCellButtonText: {
    marginRight: '6px',
  },
  label: {
    color: theme.palette.secondary.light,
    fontSize: '0.9rem',
  },
  switchSelector: {
    height: '2rem',
  },
  flag: {
    flex: 1,
    paddingRight: '10px',
  },
  countryName: {
    flex: 8,
  }
}));

/**
 * page that displays user profile (and allows editing user profile) and underneath allows changing remaining settings
 * + settings that can be changed:
 *    + language
 *    + use dark mode?
 *    + which page to display initially when opening a contact's page
 *    + manage meal categories
 *    + manage meal tags
 **/

const Settings = () => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const { user } = useAuth0();
  const { state, pathname } = useLocation();
  let navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [/*settings*/, setSettings] = useState(null); // settings is not currently used because settings are fetched from other place but might be necessary in the future

  const country = userData?.user_metadata?.countryCode ?? '';
  const countryList = useMemo(() => importedCountryList().getData(), []);

  const getUser = () => {
    if (user) {
      const userId = user.sub;
      getUserById(userId, (user) => {
        setUserData(user);
      });
    }
  }

  const getSettings = () => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        setSettings(settings);
      });
    }
  }

  useEffect(() => {
    // the auth0 user has a limited amount of info (for example no metadata). So we need to get the complete user
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, state]); // state listens to changes done in EditProfile

  useEffect(() => {
    getSettings();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateLanguageInSettings(lng) {
    if (user) {
      updateUserSettingsForCategory(user.sub, 'language', lng, (newSettings) => {
        getSettings();
        // send settings changed to trigger reloading settings in App.jsx every time they get updated
        navigate(pathname, { replace: true, state: { settingsChanged: true } });
      });
    }
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {console.log('changed language to ', lng)});
    updateLanguageInSettings(lng);
  }

  const changeCountry = (newCountryCode) => {
    const newCountryName = countryList.find(c => c.value === newCountryCode)?.label;
    if (user) {
      const newMetadata = {
        ...userData.user_metadata ?? {},
        country: newCountryName,
        countryCode: newCountryCode,
      }

      updateUserMetadata(user.sub, newMetadata, (newUserData) => {
        setUserData(newUserData);
      });
    }
  }

  function getLanguageMenuItems() {
    return allLanguages.map(lang => <MenuItem key={lang.key} value={lang.key}>{lang.description}</MenuItem>);
  }

  function getCountryMenuItems() {
    return countryList.map(c => <MenuItem key={c.value} value={c.value} name={c.label}>
      <Flag className={classes.flag} code={c.value} height={15} /><span className={classes.countryName}>{c.label}</span>
    </MenuItem>);
  }

  const goToEditProfile = () => {navigate('editProfile', { state: { userData } });};
  const goToAdvancedSettings = () => {navigate('advanced');};

  return (
    <>
      <Navbar pageTitle={t('Settings')} rightSideComponent={<EditButton onClick={goToEditProfile} />} />
      <Box className={classes.settings}>
        {userData ? <Profile userData={userData} /> : <ProfilePlaceholder />}
        <Table aria-label="profile data" size="medium" className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label} id="language-select-label">{t('Language')}</Typography></TableCell>
              <TableCell className={classes.tableCell}>
                <Select input={<InputBase />} labelId="language-select-label" id="language-select" value={i18n.language} onChange={event => {changeLanguage(event.target.value);}}>
                  {getLanguageMenuItems()}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label} id="country-select-label">{t('Country')}</Typography></TableCell>
              <TableCell className={classes.tableCell}>
                <Select input={<InputBase />} labelId="country-select-label" id="country-select" value={country} onChange={event => {changeCountry(event.target.value);}}>
                  {getCountryMenuItems()}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.buttonTableCell} colSpan={2} onClick={goToAdvancedSettings}>
                <Box className={classes.tableCellButton}>
                  <Typography className={classes.tableCellButtonText}>{t('Advanced Settings')}</Typography>
                  <ArrowForwardIos color="primary" fontSize="small" />
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <SupportButton />
        <LogoutButton />
      </Box>
    </>
  );
}

export default withLoginRequired(Settings);
