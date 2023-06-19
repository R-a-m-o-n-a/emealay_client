import React, { useEffect, useState } from 'react';
import { alpha, ListItemText, useTheme } from '@material-ui/core';
import CreatableSelect from 'react-select/creatable';
import ReactSelect from 'react-select';
import { arrayOf, bool, func, object, string } from "prop-types";
import { useTranslation } from "react-i18next";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { LoadingBody } from "../Loading";
import { getSettingsOfUser, updateUserSettingsForCategory } from "../Settings/settings.util";
import { reactSelectTheme } from "./meals.util";

/** Select input that lets the user choose meal tags.
 * If allowCreate is true, user can also create new tags. */
const SelectMealTags = (props) => {
  const { t } = useTranslation();
  const muiTheme = useTheme();
  const { typography, palette } = muiTheme;

  const {
    updateTags,
    currentTags,
    allowCreate,
    placeholderText,
    className,
    customControlStyles,
    otherUserId,
    own,
  } = props;

  const { user } = useAuth0();

  const [allTags, setAllTags] = useState(undefined);

  useEffect(() => {
    if (own) {
      if (user) {
        const userId = user.sub;
        getSettingsOfUser(userId, (settings) => {
          setAllTags(settings.mealTags);
        });
      }
    } else {
      getSettingsOfUser(otherUserId, (settings) => {
        setAllTags(settings.mealTags);
      });
    }
  }, [own, user, otherUserId]);

  const addTag = (tagToAdd) => {
    allTags.push(tagToAdd);
    if (user) {
      updateUserSettingsForCategory(user.sub, 'mealTags', allTags, (setting) => {
        setAllTags(setting.mealTags);
      });
    }
  }

  const handleTagChange = (newTags, actionMeta) => {
    updateTags(newTags);
    if (allowCreate && actionMeta.action === 'create-option') {
      addTag(actionMeta.option);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      ...customControlStyles,
      fontSize: typography.body1.fontSize,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: typography.body1.fontSize,
    }),
    noOptionsMessage: (provided, state) => ({
      ...provided,
      fontSize: typography.body1.fontSize,
    }),
    placeholder: (provided, state) => ({
      ...provided,
      paddingLeft: '5px',
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: '3px',
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      fontSize: '1rem',
      paddingRight: '6px',
      borderRight: '1px dotted ' + alpha(palette.text.primary, 0.5),
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      paddingLeft: '5px',
      paddingRight: '5px',
    }),
  }

  const commonProps = {
    className,
    isClearable: true,
    isMulti: true,
    styles: customStyles,
    theme: givenTheme => reactSelectTheme(givenTheme, muiTheme, true),
    placeholder: <ListItemText primary={placeholderText || t('Select Tags') + '...'} />,
    options: allTags,
    value: currentTags,
    getOptionLabel: option => option.label || option, // option.label is necessary for typing new options
    getOptionValue: option => option.label || option,
    onChange: handleTagChange,
    blurInputOnSelects: false,
  }

  if (allowCreate) {
    // getNewOptionData is necessary because otherwise the new option will be an object with identical label and value attributes
    return <CreatableSelect {...commonProps} getNewOptionData={(value) => value} noOptionsMessage={() => t('Type to add Tags')} />;
  } else {
    return <ReactSelect {...commonProps} noOptionsMessage={() => {return (allTags !== undefined) ? t('No results') : (t('Loading') + '...')}} />;
  }
}

SelectMealTags.propTypes = {
  /** setState function of the parent component's meal that takes key and value of attribute and updates it */
  updateTags: func.isRequired,
  /** current tags assigned to the meal */
  currentTags: arrayOf(string),
  /** can new tags be created? */
  allowCreate: bool,
  /** optional custom placeholder text */
  placeholderText: string,
  /** optional className for styling */
  className: string,
  /** style object to allow overwriting styles of the select control component */
  customControlStyles: object,
  /** tags of the logged in user or not? */
  own: bool,
  /** userId of the user whose tags should be displayed (if own is false) */
  otherUserId: string,
}

SelectMealTags.defaultProps = {
  allowCreate: false,
  currentTags: undefined,
  placeholderText: null,
  own: true,
}

export default withAuthenticationRequired(SelectMealTags, {
  onRedirecting: () => <LoadingBody />,
});

