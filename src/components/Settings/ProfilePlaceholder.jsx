import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  imageWrapper: {
    width: '8rem',
    height: '8rem',
    margin: 'auto',
  },
  table: {
    borderTop: '1px solid rgba(224, 224, 224, 1)',
    margin: '1rem 0',
  },
  tableCell:{
    padding: '12px 10px',
    '&:first-child': {
      width: '25%',
    }
  },
  label: {
    color: theme.palette.secondary.light,
    fontSize: '0.8rem'
  },
}));

/** empty dummy profile to be displayed while userData is loading */
const ProfilePlaceholder = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box className={classes.userProfile}>
      <Box className={classes.imageWrapper}>
        <AccountCircle style={{fontSize: '8rem', color: '#bbbbbb'}} />
      </Box>

      <TableContainer className={classes.table}>
        <Table aria-label="profile data loading" size="small">
          <TableBody>
            <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Name')}</Typography></TableCell>
              <TableCell className={classes.tableCell}/>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Username')}</Typography></TableCell>
              <TableCell className={classes.tableCell}/>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Email address')}</Typography></TableCell>
              <TableCell className={classes.tableCell}/>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default withAuthenticationRequired(ProfilePlaceholder);
