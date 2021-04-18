import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./Buttons/LoginButton";
import Loading from "./Loading";
import { Box, Button, InputBase, MenuItem, Select, Typography } from "@material-ui/core";
import { ArrowForwardIos, Translate } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
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
    fontFamily: 'Cookie',
    fontSize: '140%',
  },
  cookieSubheading: {
    fontFamily: 'Cookie',
    fontSize: '1.7rem',
    lineHeight: '1.8rem',
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

/**
 * Home component shows info text and login button if user is not logged in
 * @component
 */
const Home = () => {
  const classes = useStyles();
  let history = useHistory();
  const { t, i18n } = useTranslation();

  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <Loading />;

  let greeting = '';
  if (isAuthenticated && user && user.given_name) greeting = ', ' + user.given_name;
  return (
    <>
      <Navbar pageTitle="Home" />
      <Box className={classes.centeredContent}>
        <Typography variant="h4">{t('Welcome to')} <span className={classes.cookieHeading}>Emealay</span>{greeting}<span className={classes.cookieHeading}>!</span></Typography>
        <Typography variant="h5" className={classes.cookieSubheading}>"Where every meal is made<br />instead of thrown away"</Typography>
        <br />
        <br />
        {isAuthenticated ?
          <Button variant="contained"
                  size="large"
                  color="primary"
                  className={classes.button}
                  onClick={() => {history.push('/plans');}}
                  endIcon={<ArrowForwardIos />}>{t('Plan some meals')}</Button>
          : <Box>
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

        }
      </Box>
    </>
  );
};

export default Home;
