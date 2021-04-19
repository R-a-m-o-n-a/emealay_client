import React, { useState } from 'react';
import { IconButton, Button, DialogTitle, Dialog, TextField, InputAdornment, Grid } from '@material-ui/core';
import { Share, Link, FileCopy, AssignmentTurnedInRounded } from '@material-ui/icons';
import { string } from "prop-types";

/** Button that opens native share API on the devices or provides the link if API is not supported */
const ShareButton = (props) => {
  const { title, link } = props;
  const [isCopyLinkOpen, setIsCopyLinkOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const share = () => {
    console.log('share ', link);
    if (navigator.share) {
      navigator.share({
        title,
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
      <Dialog open={isCopyLinkOpen} onClose={() => {setIsCopyLinkOpen(false)}} PaperProps={{style: {padding: '2em'}}}>
        <DialogTitle style={{padding: '0 0 0.5em'}}>{title}</DialogTitle>
        <Grid container spacing={2} justify="space-between" alignItems="center" wrap="wrap">
          <Grid item xs style={{flexGrow: 5}}>
          <TextField id="link-input" variant="standard" value={link} color="secondary" InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Link />
              </InputAdornment>
            ),
          }} />
          </Grid>
          <Grid item xs>
          <Button startIcon={isCopied ? <AssignmentTurnedInRounded /> : <FileCopy />} variant="contained" color={"secondary"} onClick={copyToClipboard}>
            {isCopied ? 'Copied' : 'Copy'}
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
}

export default ShareButton;
