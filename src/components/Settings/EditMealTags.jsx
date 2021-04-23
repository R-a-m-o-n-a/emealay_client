import React, { useEffect, useState } from 'react';
import ChipInput from 'material-ui-chip-input'
import { func } from "prop-types";
import { getSettingsOfUser, updateUserSettingsForCategory } from "./settings.util";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import { Chip } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  chipInput: {
    padding: '8px',
  },
  input: {
    paddingBottom: '4px !important',
    paddingLeft: '4px',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const EditMealTags = (props) => {
  const classes = useStyles();
  const { onUpdateSettings, onUpdateTags } = props;
  const [tags, setTags] = useState([]);
  const { user } = useAuth0();
  const { t } = useTranslation();

  const fetchTags = () => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        console.log('getting tags from settings', settings.mealTags);
        setTags(settings.mealTags || []);
      }); // tags must not be empty!
    }
  }

  useEffect(fetchTags, [user]);

  function updateTags(tagsToAdd) {
    console.log('updating', tagsToAdd);
    if (user) {
      updateUserSettingsForCategory(user.sub, 'mealTags', tagsToAdd, (setting) => {
        if (onUpdateSettings) onUpdateSettings(setting);
        if (onUpdateTags) onUpdateTags(setting.mealTags);
        setTags(setting.mealTags);
      });
    }
  }

  const addTag = (tagToAdd) => {
    tags.push(tagToAdd);
    updateTags(tags);
  }

  const removeTag = (tagToDelete) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    updateTags(updatedTags);
  }

  return (
    <ChipInput fullWidth
               placeholder={t('placeholder tag')}
               variant="outlined"
               value={tags}
               onAdd={addTag}
               onDelete={removeTag}
               label={t('Tags')}
               color="secondary"
               classes={{ inputRoot: classes.chipInput, input: classes.input }}
               chipRenderer={(data) => {
                 return <Chip color="secondary" label={data.text} onDelete={data.handleDelete} deleteIcon={<Delete />} className={classes.chip} />
               }} />
  );
}

EditMealTags.propTypes = {
  onUpdateSettings: func,
  onUpdateTags: func,
}

export default EditMealTags;
