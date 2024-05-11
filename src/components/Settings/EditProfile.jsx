import React, { useState } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Box, Button, Card, CardContent, CardHeader, Collapse, IconButton, InputBase, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import { ExpandLess, ExpandMore, InfoTwoTone } from "@material-ui/icons";
import ImageUpload from "../Images/ImageUpload";
import { updateUser, updateUserMetadata } from "./settings.util";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import Navbar from "../Navbar";
import BackButton from "../Buttons/BackButton";
import { muiTableBorder } from "../util";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import SavingButton from "../Buttons/SavingButton";
import { useTracking } from "react-tracking";

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
const EditProfile = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  let { state } = useLocation();
  const navigate = useNavigate();
  const { trackEvent } = useTracking();

  let {
    userData,
    userData: {
      user_metadata: metadata,
      user_id: userId,
      name: userName,
      email: userEmail,
    }
  } = state;

  const [profileImage, setProfileImage] = useState(metadata.picture || userData.picture);
  const [showReset, setShowReset] = useState(!!metadata.picture);
  const [username, setUsername] = useState(metadata.username);
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [infoCollapsed, setInfoCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const usingOAuth = userId.includes("oauth");
  const foreignAccountProvider = userId.includes("google") ? 'Google' : '';

  const editAndClose = (event) => {
    event.preventDefault();
    setIsSaving(true);

    const newMetadata = {
      ...metadata,
      username: username,
    }

    trackEvent({ event: 'update-user-metadata', newMetadata })
    // @todo saving is only waiting for metadata for now because in Emilia there is only google login, not email/password
    updateUserMetadata(userId, newMetadata, onSave);
    if (!usingOAuth) {
      const newUserData = {
        name, email, nickname: username
      };
      updateUser(userId, newUserData, null);
    }
  }

  const onSave = () => {
    setIsSaving(false);
    goToSettings();
  };

  const updateProfileImage = (image) => {
    const imageSrc = image.url;
    // console.log('set uploaded source', imageSrc);
    setProfileImage(imageSrc);
    updateProfileImageInMetadata(imageSrc);
  }

  const updateProfileImageInMetadata = (imageSrc) => {
    trackEvent({ 'event': 'changeProfilePicture', image: imageSrc });
    const newMetadata = {
      ...metadata,
      picture: imageSrc,
    }

    updateUserMetadata(userId, newMetadata, (newUserData) => {
      setProfileImage(newUserData.user_metadata.picture || newUserData.picture);
      setShowReset(!!newUserData.user_metadata.picture);
    });
  }

  const deleteProfileImage = () => {
    updateProfileImageInMetadata(null);
  }

  const goToSettings = () => {
    // send state to make Profile reload new data
    navigate('../', { state: { newUsername: username } });
  }

  return (
    <>
      <Navbar pageTitle={t('Edit Profile')} leftSideComponent={<BackButton onClick={goToSettings} />} />
      <Box className={classes.userProfile}>
        <ImageUpload uploadedImages={[profileImage]}
                     imageName={t('profile picture of {{name}}', { name })}
                     category="userProfile"
                     categoryId={userId}
                     onChangeUploadedImages={updateProfileImage}
                     useSingleUploadOverlay />
        {showReset && <Button disableRipple className={classes.deleteImage} onClick={deleteProfileImage}>{t('Reset Image')}</Button>}

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
                {t('You can, however, set a custom profile picture and username.')}
              </Typography>
            </CardContent>
          </Collapse>
        </Card>}

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
                  <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Username')}</Typography></TableCell>
                  <TableCell className={classes.tableCell}>
                    <InputBase value={username} name="username" onChange={e => setUsername(e.target.value)} label={t('Username')} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableCell}><Typography className={classes.label}>{t('Email address')}</Typography></TableCell>
                  <TableCell className={classes.tableCell}>
                    <InputBase value={email} name="email" type="email" onChange={e => setEmail(e.target.value)} label={t('example@company.com')} disabled={usingOAuth} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <SavingButton isSaving={isSaving} color="primary" type="submit" variant="contained" size="large" className={classes.submitButton}>
            {t('Save Changes')}
          </SavingButton>
        </form>
      </Box>
    </>
  );
};

/**
 * This is a security Wrapper for the component EditProfile to make sure that it receives the state ot needs, which is always the case if coming from settings.
 * The only scenario where this becomes important, is, if someone goes on the link to directly edit, without having the state. (hard refresh etc.)
 * @returns {JSX.Element} either a redirect or if state exists, EditProfile
 * @constructor
 */
const EditProfileWrapper = () => {
  let { state } = useLocation();

  if (!state || !state.userData) {
    return <Navigate to="/settings" replace />;
  }
  return <EditProfile />;
}

export default withAuthenticationRequired(EditProfileWrapper);
