import React from 'react';
import { AppBar, Box, Toolbar, Typography, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { any, bool, func, string } from "prop-types";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  topNav: props => ({
    height: props.height,
    minHeight: props.height,
    justifyContent: 'space-between',
    backgroundColor: props.secondary ? theme.palette.secondary.main : theme.palette.primary.main,
  }),
  rightSide: {
    display: 'flex',
    alignItems: 'center',
  },
  headline: {
    fontSize: '30px',
    lineHeight: '35px',
    whiteSpace: 'nowrap',
    overflow: "hidden",
    textOverflow: "ellipsis",
    flexGrow: 20,
    color: theme.palette.background.default,
  },
  logo: {
    marginRight: '1rem',
  },
}));
/**
 * Navbar visible on all pages.
 * Has customizable title, left and right side components and an optional onClick for the title
 */
const Navbar = (props) => {
  const classes = useStyles(props);
  const { pageTitle, rightSideComponent, leftSideComponent, titleOnClick } = props;
  let history = useHistory();
  const { palette } = useTheme();

  return (
    <>
      <AppBar position="sticky" style={{ maxWidth: '100%' }}>
        <Toolbar className={classes.topNav}>
          {leftSideComponent ||
          <img src={palette.type === 'dark' ? '/Emealay_logo_dark.png' : '/Emealay_logo_white.png'}
               className={classes.logo}
               alt="Emealay Logo"
               height="35px"
               onClick={() => {history.push('/home');}} />
          }
          <Typography onClick={titleOnClick} variant='h4' className={classes.headline}>{pageTitle}</Typography>
          {rightSideComponent &&
          <Box className={classes.rightSide}>
            {rightSideComponent}
          </Box>
          }
        </Toolbar>
      </AppBar>
    </>
  )
    ;
}

Navbar.propTypes = {
  /** title of current page */
  pageTitle: string.isRequired,
  /** component to be displayed on the right side (for example Edit Button) */
  rightSideComponent: any,
  /** component to be displayed on the left side (for example Back Button) */
  leftSideComponent: any,
  /** custom height, may not be of use anymore, but is still working */
  height: string,
  /** optional onClick function for the title */
  titleOnClick: func,
  /** use secondary color for background? */
  secondary: bool,
};

Navbar.defaultProps = {
  rightSideComponent: null,
  leftSideComponent: null,
  height: process.env.REACT_APP_NAVBAR_TOP_HEIGHT,
  secondary: false,
};

export default Navbar;

