import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, Grid, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { AssignmentTurnedInRounded, FileCopy, Link, Share } from '@material-ui/icons';
import { string } from "prop-types";
import { useTranslation } from "react-i18next";

/** Button that opens native share API on the devices or provides the link if API is not supported */
const ShareButton = (props) => {
  const { title, link, text } = props;
  const { t } = useTranslation();
  const [isCopyLinkOpen, setIsCopyLinkOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const share = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url: link,
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch(console.error);
    } else {
      setIsCopyLinkOpen(true);
    }
  }

  const copyToClipboard = () => {
    // logic from https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    /* Get the text field */
    const copyText = document.getElementById("link-input");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    document.execCommand("copy");

    setIsCopied(true);
  }

  return (
    <>
      <IconButton variant="outlined" onClick={share}>
        <Share />
        {/*<FontAwesomeIcon icon={faShareSquare} />*/}
      </IconButton>
      <Dialog open={isCopyLinkOpen} onClose={() => {setIsCopyLinkOpen(false); setIsCopied(false);}} PaperProps={{style: {padding: '2em'}}}>
        <DialogTitle style={{padding: '0 0 0.5em'}}>{title}</DialogTitle>
        <Grid container spacing={2} justify="space-between" alignItems="center" wrap="wrap">
          <Grid item xs style={{flexGrow: 5}}>
          <TextField id="link-input" variant="standard" value={link} color="secondary" style={{minWidth: '160px'}} InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Link />
              </InputAdornment>
            ),
          }} />
          </Grid>
          <Grid item xs style={{textAlign: 'right'}}>
          <Button startIcon={isCopied ? <AssignmentTurnedInRounded /> : <FileCopy />} variant="contained" color={"secondary"} onClick={copyToClipboard}>
            {isCopied ? t('Copied') : t('Copy')}
          </Button>
        </Grid>
        </Grid>
      </Dialog>
    </>
  );
}

ShareButton.propTypes = {
  link: string.isRequired,
  title: string.isRequired,
  text: string.isRequired,
}

export default ShareButton;
