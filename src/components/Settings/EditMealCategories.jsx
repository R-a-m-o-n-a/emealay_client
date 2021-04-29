import React, { useEffect, useState } from 'react';
import ChipInput from 'material-ui-chip-input'
import { bool, func, object, shape, string } from "prop-types";
import { getSettingsOfUser, updateUserSettingsForCategory } from "./settings.util";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import { Box, Button, Chip, Dialog, DialogTitle } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import categoryIcons from "../Meals/CategoryIcons";

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
  chipIcon: {
    background: "transparent !important",
    marginLeft: "6px !important",
    maxHeight: "20px",
    maxWidth: "20px",
  },
  iconSelectDialog: {
    borderRadius: '25px',
  },
  iconGrid: {
    padding: '0 1rem 1rem',
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  iconListButton: {
    height: '50px',
    width: '50px',
    minWidth: '50px',
    maxWidth: '50px',
    // border: '1px solid '+ theme.palette.text.primary,
    borderRadius: '25px',
    transition: 'background 0.3s ease-in-out',

    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    }
  },
  iconListButtonSelected: {
    backgroundColor: theme.palette.primary.main,
  },
  iconInList: {
    color: theme.palette.text.primary,
  }
}));

/** Dialog that lets the user choose an icon for a meal category */
export const ChooseIconDialog = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { category, isOpen, chooseIcon, onClose } = props;
  if (isOpen && category) {
    return (
      <Dialog open={category && isOpen} onClose={onClose} PaperProps={{ className: classes.iconSelectDialog }}>
        <DialogTitle style={{ paddingBottom: 0 }}>{t('Choose Icon for {{categoryName}}', { categoryName: category.name })}</DialogTitle>
        <Box className={classes.iconGrid}>
          {categoryIcons.map((icon) => (
            <Button key={icon.name}
                    className={`${classes.iconListButton} ${category && category.icon && category.icon.iconName === icon.iconName && classes.iconListButtonSelected}`}>
              <FontAwesomeIcon icon={icon} size="2x" onClick={() => {chooseIcon(icon)}} />
            </Button>
          ))}
        </Box>
      </Dialog>
    );
  } else {
    return null;
  }
}

ChooseIconDialog.propTypes = {
  category: shape({
    name: string,
    icon: object,
  }),
  isOpen: bool.isRequired,
  onClose: func.isRequired,
  chooseIcon: func.isRequired,
}

export function updateMealCategories(userId, categoriesToAdd, onUpdateCategories, onUpdateSettings) {
  updateUserSettingsForCategory(userId, 'mealCategories', categoriesToAdd, (setting) => {
    if (onUpdateSettings) onUpdateSettings(setting);
    if (onUpdateCategories) onUpdateCategories(setting.mealCategories);
  });
}

/** Chip Input Component that displays all meal categories and lets the user delete them or change their icon, also allows creating new categories */
const EditMealCategories = (props) => {
  const classes = useStyles();
  const { onUpdateSettings, onUpdateCategories } = props;

  const { user } = useAuth0();
  const { t } = useTranslation();
  const [, updateState] = useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [categories, setCategories] = useState([]);
  const [isIconSelectOpen, setIsIconSelectOpen] = useState(false);
  const [categoryInIconSelect, setCategoryInIconSelect] = useState(null);

  const fetchCategories = () => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        setCategories(settings.mealCategories || []);
      }); // categories must not be empty!
    }
  }

  useEffect(fetchCategories, [user]);

  const addCategory = (categoryToAdd) => {
    categories.push({ name: categoryToAdd });
    updateCategories(categories);
  }

  const removeCategory = (categoryToDelete) => {
    const updatedCategories = categories.filter((category) => category !== categoryToDelete);
    updateCategories(updatedCategories);
  }

  const updateCategories = (categoriesToUpdate) => {
    if (user) {
      updateMealCategories(user.sub, categoriesToUpdate, (newCategories) => {
        if (onUpdateCategories) onUpdateCategories(newCategories);
        setCategories(newCategories);
      }, onUpdateSettings);
    }
  }

  const openIconSelect = (category) => {
    setIsIconSelectOpen(true);
    setCategoryInIconSelect(category);
  }
  const closeIconSelect = () => {
    setIsIconSelectOpen(false);
    setCategoryInIconSelect(null);
  }

  function chooseIcon(icon) {
    categories.forEach(c => {
      if (c.name === categoryInIconSelect.name) c.icon = icon;
    });
    updateCategories(categories);
    forceUpdate();
    closeIconSelect();
  }

  return (<>
      <ChipInput fullWidth
                 placeholder={t('placeholder category')}
                 variant="outlined"
                 value={categories}
                 onAdd={addCategory}
                 onDelete={removeCategory}
                 label={t('Categories')}
                 color="primary"
                 classes={{ inputRoot: classes.chipInput, input: classes.input }}
                 chipRenderer={(data) => {
                   const { value: category, value: { name, icon } } = data;
                   return <Chip color="primary"
                                label={name}
                                clickable
                                onClick={() => {openIconSelect(category)}}
                                onDelete={data.handleDelete}
                                deleteIcon={<Delete />}
                                className={classes.chip}
                                avatar={<FontAwesomeIcon icon={icon || faPlusCircle} className={classes.chipIcon} />} />
                 }} />
      <ChooseIconDialog chooseIcon={chooseIcon} onClose={closeIconSelect} isOpen={isIconSelectOpen} category={categoryInIconSelect} />
    </>
  );
}

EditMealCategories.propTypes = {
  onUpdateSettings: func,
  onUpdateCategories: func,
}

export default EditMealCategories;
