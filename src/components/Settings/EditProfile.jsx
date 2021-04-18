import React, { useEffect, useState } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Dialog,
  IconButton,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from "@material-ui/core";
import { ExpandLess, ExpandMore, InfoTwoTone } from "@material-ui/icons";
import ImageUpload from "../Images/ImageUpload";
import { updateUser, updateUserMetadata } from "./settings.util";
import { bool, func, shape } from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import { SlidingTransitionLeft } from "../util/SlidingTransition";
import Navbar from "../Navbar";
import BackButton from "../Buttons/BackButton";
import { muiTableBorder } from "../util";

const serverURL = process.env.REACT_APP_SERVER_URL;

const useStyles = makeStyles(theme => ({
  userProfile: {
    padding: '1rem 0',
    overflow: 'auto',
  },
  table: {
    borderTop: muiTableBorder(theme),
    margin: '1rem 0',
  },
  tableCell: {
    padding: '10px',
    backgroundColor: theme.palette.background.default,

    '&:first-child': {
      width: '25%',
    },
    '&:last-child': {
      fontStyle: "italic",
    }
  },
  label: {
    color: theme.palette.secondary.light,
    fontSize: '1rem',
  },
  deleteImage: {
    fontSize: '1rem',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '0.5rem',
    color: theme.palette.error.main,
    textTransform: 'none',
    width: 'max-content',
    margin: '0.2rem auto',
    display: 'block',
    padding: '0rem 0.5rem',
  },
  submitButton: {
    minWidth: '10rem',
    maxWidth: '60%',
    margin: '0 auto 1.5rem',
    display: "block",
  },
}));

/** Dialog page to edit user data, looks like Profile but is editable */
const EditProfile = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userData, onUpdateUser, isSecondary, open, closeDialog } = props;

  const colorA = isSecondary ? "primary" : "secondary";
  // const colorB = isSecondary ? "secondary" : "primary";

  const {
    user_metadata: metadata,
    user_id: userId,
    name: userName,
    email: userEmail,
  } = userData;

  const [profileImage, setProfileImage] = useState(metadata.picture || userData.picture);
  const [nickname, setNickname] = useState(metadata.nickname);
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [usingOAuth, setUsingOAuth] = useState(false);
  const [infoCollapsed, setInfoCollapsed] = useState(false);
  const [foreignAccountProvider, setForeignAccountProvider] = useState('');

  useEffect(() => {
    setUsingOAuth(userId.includes("oauth"));
    if (userId.includes("google")) {
      setForeignAccountProvider('Google');
    }
  }, [userId]);

  const updateUserData = () => {
    const newUserData = {
      name, email, nickname
    };
    updateUserMetadata(userId, { nickname }, onUpdateUser);
    updateUser(userId, newUserData, onUpdateUser);
  }

  const updateProfileImage = (image) => {
    const imageSrc = serverURL + image.path;
    setProfileImage(imageSrc);
    updateProfileImageInMetadata(imageSrc);
  }

  const updateProfileImageInMetadata = (imageSrc) => {
    updateUserMetadata(userId, {
      picture: imageSrc,
    }, onUpdateUser);
  }

  const deleteProfileImage = () => {
    updateProfileImageInMetadata(null);
    setProfileImage(userData.picture);
  }

  const editAndClose = (event) => {
    event.preventDefault();
    updateUserData();
    closeDialog();
  }

  return (
    <Dialog open={open} fullScreen onClose={closeDialog} TransitionComponent={SlidingTransitionLeft}>
      <Navbar pageTitle={t('Edit Profile')} leftSideComponent={<BackButton onClick={closeDialog} />} secondary={isSecondary} />
      <Box className={classes.userProfile}>
        <ImageUpload uploadedImages={[profileImage]}
                     imageName={t('profile picture of {{name}}', { name })}
                     category="userProfile"
                     categoryId={userId}
                     onChangeUploadedImages={updateProfileImage}
                     useSingleUploadOverlay />
        {metadata.picture && <Button disableRipple className={classes.deleteImage} onClick={deleteProfileImage}>{t('Reset Image')}</Button>}

        {usingOAuth && <Card style={{ marginTop: '1rem' }}>
          <CardHeader avatar={<InfoTwoTone />}
                      title={t('Logged in via {{provider}}', { provider: foreignAccountProvider })}
                      action={<IconButton aria-label="collapse info" onClick={() => {setInfoCollapsed(!infoCollapsed)}}>
                        {infoCollapsed ? <ExpandMore /> : <ExpandLess />}
                      </IconButton>} />
          <Collapse in={!infoCollapsed} timeout="auto" unmountOnExit>
            <CardContent style={{ paddingTop: 0 }}>
              <Typography variant="body2" color="textSecondary" component="p">
                {t(`Since you are logged in via your {{provider}} account, you cannot change your data here. You can change the data directly in your {{provider}} account and it will be adopted on the next login.`, { provider: foreignAccountProvider })}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {t('You can, however, set a custom profile picture and nickname.')}
              </Typography>
            </CardContent>
          </Collapse>
        </Card> }

        <form name="edit-user-form" onSubmit={editAndClose}>
          <TableContainer className={classes.table}>
            <Table aria-label="edit profile data" size="small">
              <TableBody>
                <TableRow>
                  <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Name')}</Typography></TableCell>
                  <TableCell className={classes.tableCell}>
                    <InputBase value={name} name="name" onChange={e => setName(e.target.value)} label={t('Name')} disabled={usingOAuth} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Nickname')}</Typography></TableCell>
                  <TableCell className={classes.tableCell}>
                    <InputBase value={nickname} name="nickname" onChange={e => setNickname(e.target.value)} label={t('Nickname')} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Email address')}</Typography></TableCell>
                  <TableCell className={classes.tableCell}>
                    <InputBase prop value={email} name="email" type="email" onChange={e => setEmail(e.target.value)} label={t('example@company.com')} disabled={usingOAuth} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Button color={colorA} type="submit" variant="contained" size="large" className={classes.submitButton}>
            {t('Save Changes')}
          </Button>
        </form>
      </Box>
    </Dialog>
  );
};

EditProfile.propTypes = {
  /** initial user data to be edited */
  userData: shape({}).isRequired,
  /** callback to be executed after user is updated (receives no parameters) */
  onUpdateUser: func.isRequired,
  /** whether to use primary or secondary color scheme */
  isSecondary: bool,
  /** is component visible? */
  open: bool,
  /** function that closes Dialog / sets open to false */
  closeDialog: func.isRequired,
}

EditProfile.defaultProps = {
  isSecondary: false,
  open: false,
}

export default withAuthenticationRequired(EditProfile);
