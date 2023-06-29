import React, { useEffect, useState } from 'react';
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import { Box, Checkbox, Table, TableBody, TableCell, TableRow, Typography, useTheme } from '@material-ui/core';
import { useAuth0 } from "@auth0/auth0-react";
import { getSettingsOfUser, updateUserSettingsForCategory } from "./settings.util";
import { makeStyles } from "@material-ui/styles";
import { muiTableBorder, withLoginRequired } from "../util";
import EditMealTags from "./EditMealTags";
import EditMealCategories from "./EditMealCategories";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteAccountButton from "../Buttons/DeleteAccountButton";
import BackButton from "../Buttons/BackButton";
import SwitchSelector from "react-switch-selector";

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
  buttonTableCell: {
    padding: '15px',
  },
  tableCellButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: theme.palette.secondary.light,
    fontSize: '0.9rem',
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
const AdvancedSettings = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useAuth0();
  const theme = useTheme();
  const { palette } = theme;
  let navigate = useNavigate();
  const { pathname } = useLocation();

  const ownStartPageOptions = [
    {
      label: t('Meals'),
      value: 0,
      selectedBackgroundColor: palette.primary.main,
      selectedFontColor: palette.primary.contrastText,
    },
    {
      label: t('Plans'),
      value: 1,
      selectedBackgroundColor: palette.primary.main,
      selectedFontColor: palette.primary.contrastText,
    },
  ];

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
  ];

  const [/*settings*/, setSettings] = useState(null); // settings is not currently used because settings are fetched from other place but might be necessary in the future
  const [ownStartPageIndex, setOwnStartPageIndex] = useState(1);
  const [contactStartPageIndex, setContactStartPageIndex] = useState(1);

  const getSettings = () => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        setSettings(settings);
        setOwnStartPageIndex(settings.ownStartPageIndex);
        setContactStartPageIndex(settings.contactStartPageIndex);
      });
    }
  }

  useEffect(getSettings, [user]);

  function updateDarkModePreference(newValue) {
    if (user) {
      updateUserSettingsForCategory(user.sub, 'prefersDarkMode', newValue, (newSettings) => {
        navigate(pathname, { replace: true, state: { settingsChanged: true } });
      });
    }
  }

  function updateOwnStartPage(newValue) {
    setOwnStartPageIndex(newValue);
    console.log(newValue);
    if (user) {
      updateUserSettingsForCategory(user.sub, 'ownStartPageIndex', newValue, getSettings);
    }
  }

  function updateContactStartPage(newValue) {
    setContactStartPageIndex(newValue);
    console.log(newValue);
    if (user) {
      updateUserSettingsForCategory(user.sub, 'contactStartPageIndex', newValue, getSettings);
    }
  }

  return (
    <>
      <Navbar leftSideComponent={<BackButton onClick={() => {navigate(-1)}} />} pageTitle={t('Advanced Settings')} />
      <Box className={classes.settings}>
        {palette ? <Table aria-label="dark-mode-settings" size="medium" className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Use dark mode?')}</Typography></TableCell>
                <TableCell className={classes.tableCell}>
                  <Checkbox checked={palette.type === 'dark'}
                            onChange={event => updateDarkModePreference(event.target.checked)}
                            inputProps={{ 'aria-label': 'use dark mode checkbox' }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Own start view')}</Typography></TableCell>
                <TableCell className={classes.tableCell}>
                  <Box className={classes.switchSelector}>
                    <SwitchSelector onChange={updateOwnStartPage}
                                    options={ownStartPageOptions}
                                    forcedSelectedIndex={ownStartPageIndex}
                                    backgroundColor={palette.background.paper}
                                    fontColor={palette.text.disabled}
                                    fontSize={theme.typography.body1.fontSize} />
                  </Box>
                </TableCell>
              </TableRow>
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
          : ''}
        <Box>
          <EditMealCategories onUpdateSettings={getSettings} />
          <br />
          <br />
          <EditMealTags onUpdateSettings={getSettings} />
        </Box>
        <br />
        <br />
        <DeleteAccountButton />
      </Box>
    </>
  );
}

export default withLoginRequired(AdvancedSettings);
