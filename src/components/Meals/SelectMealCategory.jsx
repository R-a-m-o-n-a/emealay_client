import React, { useEffect, useState } from 'react';
import { ListItem, ListItemIcon, ListItemText, useTheme } from '@material-ui/core';
import CreatableSelect from 'react-select/creatable';
import { makeStyles } from '@material-ui/styles';
import { func, string } from "prop-types";
import { useTranslation } from "react-i18next";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { LoadingBody } from "../Loading";
import { getSettingsOfUser } from "../Settings/settings.util";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChooseIconDialog, updateMealCategories } from "../Settings/EditMealCategories";
import { reactSelectTheme } from "./meals.util";
import useCategoryIcons from "./useCategoryIcons";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: '100%',
    marginTop: '0.5rem',
    marginBottom: '1rem',
  },
  errorTextField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
    }
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  listItemIcon: {
    fontSize: "1rem",
    color: theme.palette.text.primary,
    minWidth: '2rem',
  },
  chip: {
    margin: 2,
  },
}));

/** Select input that allows the user to either choose or create a meal category */
const SelectMealCategory = (props) => {
  const classes = useStyles();
  const { user } = useAuth0();
  const { t } = useTranslation();
  const muiTheme = useTheme();

  const [categoryIcons, fireIconReload] = useCategoryIcons();
  const { currentCategory: categoryName, updateMeal } = props;

  const [currentCategory, setCurrentCategory] = useState(categoryName ? { name: categoryName, icon: null } : undefined);
  const [allCategories, setAllCategories] = useState([]);
  const [newCategory, setNewCategory] = useState(null);
  const [isIconSelectOpen, setIsIconSelectOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        setAllCategories(settings.mealCategories || []);
      });
    }
  }, [user]);

  useEffect(() => {
    if (categoryName) {
      setCurrentCategory({ name: categoryName, icon: categoryIcons[categoryName] });
    } else {
      setCurrentCategory(undefined);
    }
  }, [categoryName, categoryIcons]);

  const SelectOption = props => {
    const { data: { name, icon }, innerProps } = props;

    return (
      <ListItem button {...innerProps} >
        <ListItemIcon className={classes.listItemIcon}>
          {icon ? <FontAwesomeIcon icon={icon} /> : null}
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    );
  };

  const ChosenOption = (props) => {
    const { data: { name, icon } } = props;
    return (<>
        <ListItemIcon className={classes.listItemIcon}>
          {icon ? <FontAwesomeIcon icon={icon} /> : null}
        </ListItemIcon>
        <ListItemText style={{ margin: 'none' }} primary={name} /></>
    );
  };

  const handleCategoryChange = (newCategory, actionMeta) => {
    console.log(newCategory, actionMeta);
    updateMeal('category', newCategory ? newCategory.name : newCategory);
    if (actionMeta.action === 'create-option') {
      setIsIconSelectOpen(true);
      setNewCategory(newCategory);
      addCategory(newCategory);
    }
  };

  const addCategory = (categoryToAdd) => {
    allCategories.push(categoryToAdd);
    if (user) {
      updateMealCategories(user.sub, allCategories, setAllCategories);
    }
  }

  return (
    <>
      <CreatableSelect className={classes.textField}
                       isClearable
                       placeholder={<ListItemText primary={t('Select Category') + '...'} />}
                       noOptionsMessage={() => t('Type to add a Category')}
                       components={{ Option: SelectOption, SingleValue: ChosenOption }}
                       getOptionLabel={option => option.name}
                       onChange={handleCategoryChange}
                       theme={givenTheme => reactSelectTheme(givenTheme, muiTheme, true)}
                       getNewOptionData={(value) => {
                         return {
                           name: value,
                           icon: faPlusCircle
                         }
                       }} // this is necessary because otherwise the new option will be an object with identical label and value attributes
                       options={allCategories}
                       value={currentCategory} />

      <ChooseIconDialog chooseIcon={(icon) => {
        if (!newCategory) throw new Error('new Category is empty but needed');
        if (!user) throw new Error('user is empty but needed to update categories');
        allCategories.forEach(c => {
          if (c.name === newCategory.name) c.icon = icon;
        });
        updateMealCategories(user.sub, allCategories, setAllCategories);
        fireIconReload();
        setIsIconSelectOpen(false);
        setNewCategory(null);
      }} onClose={() => {
        setIsIconSelectOpen(false);
        setNewCategory(null);
      }} isOpen={isIconSelectOpen} category={newCategory} />
    </>
  );
}

SelectMealCategory.propTypes = {
  /** current category assigned to the meal */
  currentCategory: string,
  /** setState function of the parent component's meal that takes key and value of attribute and updates it */
  updateMeal: func.isRequired,
}

export default withAuthenticationRequired(SelectMealCategory, {
  onRedirecting: () => <LoadingBody />,
});

