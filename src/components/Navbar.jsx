import React from 'react';
import { AppBar, Box, Toolbar, Typography, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { any, bool, func, string } from "prop-types";
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  topNav: props => ({
    height: process.env.REACT_APP_NAV_TOP_HEIGHT + 'px',
    minHeight: process.env.REACT_APP_NAV_TOP_HEIGHT + 'px',
    justifyContent: 'space-between',
    backgroundColor: props.secondary ? theme.palette.secondary.main : theme.palette.primary.main,
  }),
  rightSide: {
    display: 'flex',
    alignItems: 'center',
  },
  headline: {
    fontSize: '29px',
    lineHeight: '32px',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    overflow: "hidden",
    textOverflow: "ellipsis",
    flexGrow: 20,
    color: theme.palette.background.default,
  },
  logo: {
    marginRight: '1rem',
    cursor: "pointer",
  },
}));
/**
 * Navbar visible on all pages.
 * Has customizable title, left and right side components and an optional onClick for the title
 */
const Navbar = (props) => {
  const classes = useStyles(props);
  const { pageTitle, rightSideComponent, leftSideComponent, titleOnClick } = props;
  let navigate = useNavigate();
  const { palette } = useTheme();

  return (
    <>
      <AppBar position="sticky" style={{ maxWidth: '100%' }}>
        <Toolbar className={classes.topNav} variant="dense">
          {leftSideComponent ||
          <img src={palette.type === 'dark' ? '/logo_black.svg' : '/logo_white.svg'}
               className={classes.logo}
               alt="Emealia Logo"
               height="32"
               width="28"
               onClick={() => {navigate('/');}} />
          }
          <Typography onClick={titleOnClick} className={classes.headline}>{pageTitle}</Typography>
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
  /** optional onClick function for the title */
  titleOnClick: func,
  /** use secondary color for background? */
  secondary: bool,
};

Navbar.defaultProps = {
  rightSideComponent: null,
  leftSideComponent: null,
  secondary: false,
};

export default Navbar;

