import React, { useState } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { shape } from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import CircleImage from "../Images/CircleImage";
import { muiTableBorder } from "../util";
import { Box, Dialog, Link, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  imageWrapper: {
    width: '8rem',
    height: '8rem',
    margin: 'auto',
  },
  table: {
    borderTop: muiTableBorder(theme),
    margin: '1rem 0',
  },
  tableCell: {
    padding: '10px',
    '&:first-child': {
      width: '25%',
    }
  },
  label: {
    color: theme.palette.secondary.light,
    fontSize: '0.8rem'
  },
}));

/** content page (excluding Navbar) that displays user's data */
const Profile = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userData } = props;

  const {
    user_metadata: metadata,
    name,
    email,
  } = userData;
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  return (
    <>
      <Box className={classes.imageWrapper} onClick={() => setIsImageZoomed(true)}>
        <CircleImage src={metadata.picture || userData.picture} altText={`profile picture of ${name}`} />
      </Box>

      <Dialog open={isImageZoomed} onClose={() => setIsImageZoomed(false)}>
          <img src={metadata.picture || userData.picture} alt={name} />
      </Dialog>

      <TableContainer className={classes.table}>
        <Table aria-label="profile data" size="small">
          <TableBody>
            <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Name')}</Typography></TableCell>
              <TableCell className={classes.tableCell}><Typography className={classes.text}>{name}</Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Nickname')}</Typography></TableCell>
              <TableCell className={classes.tableCell}><Typography className={classes.text}>{metadata.nickname}</Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Email address')}</Typography></TableCell>
              <TableCell className={classes.tableCell}><Typography className={classes.text}>{email}</Typography></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

Profile.propTypes = {
  /** user data to be displayed, currently displays name, metadata.nickname, email and metadata.picture (or picture if no metadata.picture is set) */
  userData: shape({}).isRequired,
}

Profile.defaultProps = {}

export default withAuthenticationRequired(Profile);
