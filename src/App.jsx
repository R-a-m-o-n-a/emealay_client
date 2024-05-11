import React, { useEffect, useMemo, useState } from 'react';
import ContentWrapper from "./components/ContentWrapper";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from '@material-ui/core/CssBaseline'; // deals with changing the background according to light/dark mode
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useAuth0 } from "@auth0/auth0-react";
import { getSettingsOfUser, updateUserSettingsForCategory } from "./components/Settings/settings.util";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import i18n, { allLanguages } from "./i18n";
import { useTracking } from "react-tracking";

/**
 * This is the main App component. It sets the MUI theme as well as the dark mode (if desired). It also deals with Frontend-Routing with the help of React Router.
 * @returns the complete App
 * @component
 */
const App = () => {
  const navigate = useNavigate();
  const { lang: paramLanguage } = useParams();
  const { state, pathname } = useLocation();

  const { user } = useAuth0();

  const { Track } = useTracking({ userId: user?.sub, datetime: new Date() });

  const prefersDarkModeInitially = useMediaQuery('(prefers-color-scheme: dark)');
  const [prefersDarkMode, setPrefersDarkMode] = useState(prefersDarkModeInitially);
  const [userLanguage, setUserLanguage] = useState();

  const getSettings = () => {
    if (user) {
      console.log('getting settings on App level');
      getSettingsOfUser(user.sub, (settings) => {
        if (settings.prefersDarkMode != null) {
          setPrefersDarkMode(settings.prefersDarkMode);
        } else if (settings.prefersDarkMode === undefined) {
          updateUserSettingsForCategory(user.sub, 'prefersDarkMode', prefersDarkModeInitially, () => {
            console.log('system-detected preference for dark mode updated in settings')
          });
        }
        if (settings.language) setUserLanguage(settings.language);
      })
    }
  }

  useEffect(() => {
    getSettings();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  /** this triggers a settings reload which triggers a theme change if necessary (f. ex. change font when switching to Japanese)
   *  can be called by other components by navigate(window.location, { replace: true, state: { settingsChanged: true } });
   *  gets reset in this component to listen to new triggers after settings were reloaded */
  useEffect(() => {
    if (state && state.settingsChanged === true) {
      getSettings();
      // reset settingsChanged State to be ready for new change
      navigate(pathname, { replace: true, state: { ...state, settingsChanged: undefined } }); // could pass other state props but make sure settingsChanged is not present
    }
  }, [state, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  /** check if language is correct (check in user settings and url param 'lang' (e.g. .../plans?lang=de))  */
  useEffect(() => {
    let newLanguage = null;
    if (userLanguage) newLanguage = userLanguage;
    // set language from URL parameter if lang parameter is set and contains a supported language
    let validParamLanguage = paramLanguage && allLanguages.some(l => l.key === paramLanguage);
    if (validParamLanguage) newLanguage = paramLanguage;
    // set new language if new language is valid & supported and different from current language
    if (newLanguage && i18n.language !== newLanguage && allLanguages.some(l => l.key === newLanguage)) {
      i18n.changeLanguage(newLanguage).then(() => {console.log('language changed to ' + newLanguage + ' according to ' + (validParamLanguage ? 'url param' : 'user settings'));});
    }
  }, [paramLanguage, userLanguage]);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
        primary: {
          main: prefersDarkMode ? '#50c56d' : '#28793c',
          dark: prefersDarkMode ? '#3cb45a' : '#1e5a2d',
        },
        secondary: {
          main: prefersDarkMode ? '#83c1ff' : '#003366',
        },
        error: {
          main: prefersDarkMode ? '#ff678b' : '#bc002d',
        },
        background: {
          default: prefersDarkMode ? '#202020' : '#ffffff',
          paper: prefersDarkMode ? '#252525' : '#fafafa',
        },
      },
      typography: {
        fontFamily: ((userLanguage === 'jp') ? 'Yu Gothic, ' : '') + 'Roboto, sans-serif', // add custom language for better readability in Japanese
        body1: {
          fontSize: '1.1rem',
        }
      },
      myColors: {
        white: '#ffffff',
        black: '#000000',
      },
    }), [prefersDarkMode, userLanguage]
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Track>
            <ContentWrapper />
          </Track>
      </ThemeProvider>
    </>
  );
}

export default App;
