import React, { useEffect, useState } from 'react';
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import Profile from "./Profile";
import { Box, Checkbox, InputBase, MenuItem, Select, Table, TableBody, TableCell, TableRow, Typography, useTheme } from '@material-ui/core';
import { useAuth0 } from "@auth0/auth0-react";
import { getSettingsOfUser, getUserById, updateUserMetadata, updateUserSettingsForCategory } from "./settings.util";
import { makeStyles } from "@material-ui/styles";
import { allLanguages } from "../../i18n";
import { muiTableBorder, withLoginRequired } from "../util";
import LogoutButton from "../Buttons/LogoutButton";
import EditButton from "../Buttons/EditButton";
import EditProfile from "./EditProfile";
import ProfilePlaceholder from "./ProfilePlaceholder";
import { func } from "prop-types";
import EditMealTags from "./EditMealTags";
import EditMealCategories from "./EditMealCategories";
import DoneButton from "../Buttons/DoneButton";
import SwitchSelector from "react-switch-selector";
import { useHistory } from "react-router-dom";
import DeleteAccountButton from "../Buttons/DeleteAccountButton";

const useStyles = makeStyles(theme => ({
  settings: {
    padding: '1rem 0',
    maxHeight: `calc(100% - ${process.env.REACT_APP_NAV_TOP_HEIGHT}px)`,
    overflowY: 'auto',
  },
  table: {
    borderTop: muiTableBorder(theme),
    margin: '1rem 0',
    overflowY: "visible",
  },
  tableCell: {
    padding: '10px',
    '&:first-child': {
      width: '25%',
    }
  },
  label: {
    color: theme.palette.secondary.light,
    fontSize: '0.8rem',
  },
  switchSelector: {
    height: '2rem',
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
const Settings = (props) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const { user } = useAuth0();
  const theme = useTheme();
  const { palette } = theme;
  let history = useHistory();

  const contactStartPageOptions = [
    {
      label: t('Meals'),
      value: 0,
      selectedBackgroundColor: palette.secondary.main,
      selectedFontColor: palette.secondary.contrastText,
    },
    {
      label: t('Plans'),
      value: 1,
      selectedBackgroundColor: palette.secondary.main,
      selectedFontColor: palette.secondary.contrastText,
    },
  ]

  const [userData, setUserData] = useState(null);
  const [/*settings*/, setSettings] = useState(null); // settings is not currently used because settings are fetched from other place but might be necessary in the future
  const [contactStartPageIndex, setContactStartPageIndex] = useState(1); // settings is not currently used because settings are fetched from other place but might be necessary in the future
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, [user]);

  const getUser = () => {
    if (user) {
      const userId = user.sub;
      getUserById(userId, (user) => {
        setUserData(user);
        const metadata = user.user_metadata;
        if (metadata && metadata.language) {
          if (metadata.language !== i18n.language) i18n.changeLanguage(metadata.language);
        }
      });
    }
  }

  const getSettings = () => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        setSettings(settings);
        setContactStartPageIndex(settings.contactStartPageIndex);
      });
    }
  }

  useEffect(getSettings, [user]);

  function updateLanguageInUserMetadata(lng) {
    if (user) {
      const newMetadata = { language: lng };
      updateUserMetadata(user.sub, newMetadata, getUser);
    }
  }

  function updateLanguageInSettings(lng) {
    if (user) {
      updateUserSettingsForCategory(user.sub, 'language', lng, getSettings);
    }
  }

  function updateDarkModePreference(newValue) {
    if (user) {
      updateUserSettingsForCategory(user.sub, 'prefersDarkMode', newValue, getSettings);
    }
    props.setDarkModeInAppLevel(newValue);
  }

  function updateContactStartPage(newValue) {
    setContactStartPageIndex(newValue);
    console.log(newValue);
    if (user) {
      updateUserSettingsForCategory(user.sub, 'contactStartPageIndex', newValue, getSettings);
    }
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(r => {console.log('changed language to ', r)});
    updateLanguageInUserMetadata(lng);
    updateLanguageInSettings(lng);
  }

  function getLanguageMenuItems() {
    return allLanguages.map(lang => <MenuItem key={lang.key} value={lang.key}>{lang.description}</MenuItem>);
  }

  const closeEditProfileDialog = () => {
    setEditDialogOpen(false);
    history.push('/settings');
  }

  const openEditProfileDialog = () => {
    setEditDialogOpen(true);
    history.push('/settings/editProfile');
  }

  return (
    <>
      <Navbar pageTitle={t('Settings')} rightSideComponent={editDialogOpen ?
        <DoneButton onClick={closeEditProfileDialog} />
        : <EditButton onClick={openEditProfileDialog} />} />
      <Box className={classes.settings}>
        {userData && !editDialogOpen ? <Profile userData={userData} /> : <ProfilePlaceholder />}
        <Table aria-label="profile data" size="small" className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label} id="language-select-label">{t('Language')}</Typography></TableCell>
              <TableCell className={classes.tableCell}>
                <Select input={<InputBase />} labelId="language-select-label" id="language-select" value={i18n.language} onChange={event => {changeLanguage(event.target.value);}}>
                  {getLanguageMenuItems()}
                </Select>
              </TableCell>
            </TableRow>
            {palette && props.setDarkModeInAppLevel && <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Use dark mode?')}</Typography></TableCell>
              <TableCell className={classes.tableCell}>
                <Checkbox checked={palette.type === 'dark'}
                          onChange={event => updateDarkModePreference(event.target.checked)}
                          inputProps={{ 'aria-label': 'use dark mode checkbox' }} />
              </TableCell>
            </TableRow>}
            <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Contact start view')}</Typography></TableCell>
              <TableCell className={classes.tableCell}>
                <Box className={classes.switchSelector}>
                  <SwitchSelector onChange={updateContactStartPage}
                                  options={contactStartPageOptions}
                                  forcedSelectedIndex={contactStartPageIndex}
                                  backgroundColor={palette.background.paper}
                                  fontColor={palette.text.disabled}
                                  fontSize={theme.typography.body1.fontSize} />
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <EditMealCategories onUpdateSettings={getSettings} />
        <br />
        <br />
        <EditMealTags onUpdateSettings={getSettings} />
        <br />
        <LogoutButton />
        <DeleteAccountButton />
      </Box>


      {userData &&
      <EditProfile userData={userData} onUpdateUser={getUser} open={editDialogOpen} closeDialog={closeEditProfileDialog} isSecondary />
      }
    </>
  );
}

Settings.propTypes = {
  /** needs to receive a function that can toggle dark mode directly from the App.jsx component */
  setDarkModeInAppLevel: func.isRequired,
}

export default withLoginRequired(Settings);
