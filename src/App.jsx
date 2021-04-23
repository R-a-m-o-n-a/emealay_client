import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import ContentWrapper from "./components/ContentWrapper";
import Home from "./components/Home";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from '@material-ui/core/CssBaseline'; // deals with changing the background according to light/dark mode
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useAuth0 } from "@auth0/auth0-react";
import { getSettingsOfUser } from "./components/Settings/settings.util";
import MealDetailViewExtern from "./components/Meals/MealDetailViewExtern";

/**
 * This is the main App component. It sets the MUI theme as well as the dark mode (if desired). It also deals with Frontend-Routing with the help of React Router.
 * @returns the complete App
 * @component
 */
const App = () => {
  const prefersDarkModeInitially = useMediaQuery('(prefers-color-scheme: dark)');
  const [prefersDarkMode, setPrefersDarkMode] = useState(prefersDarkModeInitially);

  const { user } = useAuth0();

  useEffect(() => {
    if (user) {
      getSettingsOfUser(user.sub, (settings) => {
        if (settings.prefersDarkMode) setPrefersDarkMode(settings.prefersDarkMode);
      })
    }
  }, [user]);

  const theme = useMemo(() =>
    createMuiTheme({
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
        primary: {/*
          main: prefersDarkMode ? '#9fd105' : '#658404',
          dark: prefersDarkMode ? '#6b7a12' : '#4a5700',*/
          main: '#ac0013',
          dark: '#ac0013',
        },
        secondary: {
          main: prefersDarkMode ? '#83b6d8' : '#1a274f',
        },
        error: {
          main: prefersDarkMode ? '#f56b6f' : '#ac0013',
        },
        background: {
          default: prefersDarkMode ? '#202020' : '#ffffff',
          paper: prefersDarkMode ? '#252525' : '#fafafa',
          // paper: prefersDarkMode ? '#202020' : '#ffffff',
        },
      },/*
      typography: {
        body1: {
          fontSize: '1.2rem',
        }
      },*/
      myColors: {
        white: '#ffffff',
        black: '#000000',
      },
    }), [prefersDarkMode]
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/meals/view/:mealId"><MealDetailViewExtern /></Route>

          <Route exact path="/meals"><ContentWrapper activeTab="meals" /></Route>
          <Route exact path="/meals/add"><ContentWrapper activeTab="meals/add" /></Route>
          <Route exact path="/plans"><ContentWrapper activeTab="plans" /></Route>
          <Route exact path="/plans/add"><ContentWrapper activeTab="plans/add" /></Route>
          <Route path="/social"><ContentWrapper activeTab="social" /></Route>
          <Route exact path="/settings"><ContentWrapper activeTab="settings" setDarkMode={setPrefersDarkMode} /></Route>
        </Switch>
      </ThemeProvider>
    </>
  );
}

export default App;
