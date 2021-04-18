import React, { useEffect, useState } from 'react';
import { ListItemText, useTheme } from '@material-ui/core';
import CreatableSelect from 'react-select/creatable';
import ReactSelect from 'react-select';
import { arrayOf, bool, func, object, string } from "prop-types";
import { useTranslation } from "react-i18next";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { LoadingBody } from "../Loading";
import { getSettingsOfUser, updateUserSettingsForCategory } from "../Settings/settings.util";
import { reactSelectTheme } from "./meals.util";

const SelectMealTags = (props) => {
  const { t } = useTranslation();
  const muiTheme = useTheme();

  const {
    updateTags,
    currentTags,
    allowCreate,
    placeholderText,
    className,
    customControlStyles,
  } = props;

  const { user } = useAuth0();

  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        setAllTags(settings.mealTags);
      });
    }
  }, [user]);

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
  }

  if (allowCreate) {
    // getNewOptionData is necessary because otherwise the new option will be an object with identical label and value attributes
    return <CreatableSelect {...commonProps} getNewOptionData={(value) => value} />;
  } else {
    return <ReactSelect {...commonProps} />;
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
  className: string,
  customControlStyles: object,
}

SelectMealTags.defaultProps = {
  allowCreate: false,
  currentTags: undefined,
  placeholderText: null,
}

export default withAuthenticationRequired(SelectMealTags, {
  onRedirecting: () => <LoadingBody />,
});

