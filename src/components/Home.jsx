import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./Buttons/LoginButton";
import Loading from "./Loading";
import { Box, Button, InputBase, MenuItem, Select, Typography } from "@material-ui/core";
import { Translate } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Trans, useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import { allLanguages } from "../i18n";

const useStyles = makeStyles(theme => ({
  centeredContent: {
    textAlign: 'center',
    margin: "2rem 3em",
  },
  forwardButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    margin: '3px calc(0.5rem + 1px)', // align placement with Logo
  },
  cookieHeading: {
    fontFamily: 'Neucha',
    fontSize: '120%',
  },
  cookieSubheading: {
    fontFamily: 'Neucha',
    fontSize: '1.5rem',
    lineHeight: '1.6rem',
    marginTop: '1rem',
  },
  select: {
    color: theme.palette.secondary.main,
    paddingLeft: '0.5rem',
  },
  selectIcon: {
    color: theme.palette.secondary.main,
    marginRight: '-5px',
  }
}));

//@todo set start page according to settings
const OWN_START_PAGE = 'meals';

/**
 * Home component shows info text and login button if user is not logged in
 * @component
 */
const Home = () => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <Loading />;
  if (isAuthenticated) return <Navigate replace to={OWN_START_PAGE} />;

  return (
      <>
        <Navbar pageTitle="Home" />
        <Box className={classes.centeredContent}>

          <Typography variant="h4"><Trans>Welcome to <span className={classes.cookieHeading}>Emealia</span>!</Trans></Typography>
          <Typography variant="h5" className={classes.cookieSubheading}><Trans>APP_SUBTITLE</Trans></Typography>
          <br />
          <br />
          <Box>
            <Typography>{t('Please log in to use the app')}</Typography>
            <br />
            <LoginButton />
            <br />
            <br />
            <br />

            <Button variant="outlined" color="secondary" size="medium" startIcon={<Translate />}>
              <Select input={<InputBase />}
                      className={classes.select}
                      labelId="language-select-label"
                      inputProps={{ classes: { icon: classes.selectIcon } }}
                      id="language-select"
                      value={i18n.language}
                      onChange={event => {
                        i18n.changeLanguage(event.target.value).then()
                      }}>
                {allLanguages.map(lang => <MenuItem key={lang.key} value={lang.key}>{lang.description}</MenuItem>)}
              </Select>
            </Button>
          </Box>
        </Box>
      </>
  );
};

export default Home;
