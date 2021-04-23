import React, { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { Box, Button, Collapse, Divider, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import MealDetailView from "./MealDetailView";
import { fetchAndUpdateMealsFromUser } from "./meals.util";
import useCategoryIcons from "./useCategoryIcons";
import { bool, string } from "prop-types";
import { withLoginRequired } from "../util";
import MealAvatar from "./MealAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectMealTags from "./SelectMealTags";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem",
    fontFamily: "Cookie",
    fontSize: "1.5rem",
    lineHeight: "1.6rem",
  },
  listItemIcon: {
    fontSize: "1rem",
    color: theme.palette.text.primary,
    minWidth: '2rem',
  },
  nestedListItem: {
    paddingLeft: theme.spacing(4),
  },
  filterTags: {
    borderRadius: 0,
    marginTop: 0,
  },
  optionRowButton: {
    margin: '5px 0.5rem 5px',
    padding: '0 5px',
  }
}));

/** content of page that displays all meals of a given user and opens their details views on click (not including Navbar) */
const Meals = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  let history = useHistory();

  const [, updateState] = useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterTags, setFilterTags] = useState([]);
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [mealsByCategory,] = useState(new Map());
  const [isCategoryOpen, setIsCategoryOpen] = useState({});
  const [allCategoriesClosed, setAllCategoriesClosed] = useState(false);
  const [categoryIcons] = useCategoryIcons();

  const { own, userId } = props;

  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [mealBeingViewed, setMealBeingViewed] = useState(null);
  const [emptyListFound, setEmptyListFound] = useState(false);

  const updateMealsCallback = (mealsFound) => {
    setMeals(mealsFound);
    setFilteredMeals(mealsFound);
    if (mealsFound.length === 0) {
      setEmptyListFound(true);
    }
  }

  const sortMealsIntoCategories = () => {
    mealsByCategory.clear();
    const mealsWithoutCategory = [];
    const categoriesInitiallyExpanded = true;
    filteredMeals.sort(function (a, b) {
      if (!b.category) return 1;
      if (!a.category) return -1;
      return a.category > b.category ? 1 : -1;
    });
    filteredMeals.forEach(meal => {
      if (meal.category) {
        const key = meal.category;
        let mappedMeals = mealsByCategory.get(key);
        if (!mappedMeals) {
          mealsByCategory.set(key, [meal]);
          updateIsCategoryOpen(key, categoriesInitiallyExpanded);
        } else {
          mappedMeals.push(meal);
        }
      } else {
        mealsWithoutCategory.push(meal);
      }
    });
    if (mealsWithoutCategory.length > 0) {
      const key = t('Meals without category');
      mealsByCategory.set(key, mealsWithoutCategory);
      updateIsCategoryOpen(key, categoriesInitiallyExpanded);
    }
    forceUpdate();
  }

  const updateIsCategoryOpen = (key, value) => {
    setIsCategoryOpen(prevState => {return { ...prevState, [key]: value }});
  }

  const fetchAndUpdateMeals = () => {
    fetchAndUpdateMealsFromUser(userId, updateMealsCallback);
  }

  useEffect(() => {
    fetchAndUpdateMeals();
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    sortMealsIntoCategories();
    // eslint-disable-next-line
  }, [filteredMeals]);

  useEffect(() => {
      if (filterTags.length > 0) {
        const newFilteredMeals = meals.filter(meal => {
          if (!meal.tags || meal.tags.length === 0) return false;
          return filterTags.every(tag => meal.tags.includes(tag));
        });
        setFilteredMeals(newFilteredMeals);
      } else {
        setFilteredMeals(meals);
      }
      // eslint-disable-next-line
    }, [filterTags]
  )
  ;

  const openMealDetailView = (meal) => {
    setMealBeingViewed(meal);
    history.push('/meals/detail');
    setDetailViewOpen(true);
  };

  const getListItems = () => {
    const listItems = [];
    mealsByCategory.forEach((meals, categoryName) => {
      const listItemsForCategory = [];
      meals.forEach(meal => {
        listItemsForCategory.push(
          <ListItem key={meal._id} className={classes.nestedListItem} button onClick={() => {openMealDetailView(meal); }}>
            <ListItemAvatar>
              <MealAvatar meal={meal} />
            </ListItemAvatar>
            <ListItemText primary={meal.title} />
          </ListItem>,
          <Divider key={'Divider' + meal._id} />
        );
      });
      const open = isCategoryOpen[categoryName];
      const icon = categoryIcons[categoryName];
      listItems.push(
        <ListItem button key={categoryName} onClick={() => {
          updateIsCategoryOpen(categoryName, !isCategoryOpen[categoryName]);
        }}>
          {icon && <ListItemIcon className={classes.listItemIcon}>
            <FontAwesomeIcon icon={icon} />
          </ListItemIcon>}
          <ListItemText primary={categoryName} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>,
        <Collapse key={categoryName + 'MealList'} in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {listItemsForCategory}
          </List>
        </Collapse>);
    });
    return listItems;
  }

  const updateFilterTags = (newTags) => {
    setFilterTags(newTags);
  }

  const toggleAllCategories = () => {
    let allClosed = Object.values(isCategoryOpen).every(isOpen => !isOpen);
    Object.keys(isCategoryOpen).forEach(category => {
      updateIsCategoryOpen(category, allClosed);
    });
  }

  useEffect(() => {
    setAllCategoriesClosed(Object.values(isCategoryOpen).every(isOpen => !isOpen));
  }, [isCategoryOpen]);

  return (
    <>
      {meals.length === 0 ?
        <Typography className={classes.infoText}>{emptyListFound ? t("Looks like there are no meals here yet") : t('Loading') + '...'} </Typography> :
        <>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant={"text"}
                    className={classes.optionRowButton}
                    color="secondary"
                    onClick={() => {setIsFilterOpen(prevState => !prevState)}}
                    endIcon={isFilterOpen ? <ExpandLess /> : <ExpandMore />}>
              {t('Filter')}
            </Button>
            <Button variant="text"
                    className={classes.optionRowButton}
                    color="primary"
                    onClick={toggleAllCategories}>{allCategoriesClosed ? t('expand all') : t('collapse all')}</Button>
          </Box>
          <Divider />
          {isFilterOpen && <>
            <SelectMealTags currentTags={filterTags}
                            updateTags={updateFilterTags}
                            placeholderText={t('Filter by Tags')}
                            className={classes.filterTags}
                            customControlStyles={{ borderRadius: 0 }} />
            <Divider />
          </>}
          {filteredMeals.length === 0 ?
            <Typography className={classes.infoText}>{t('No meals found for filter selection')}</Typography> :
            <List component="nav" className={classes.root} aria-label="meal list">
              {getListItems()}
            </List>}
        </>
      }
      <MealDetailView open={detailViewOpen} meal={mealBeingViewed} allowEditing={own} allowImporting={!own} closeDialog={() => {
        history.push('/meals');
        setMealBeingViewed(null);
        setDetailViewOpen(false);
      }} onDoneEditing={fetchAndUpdateMeals} />
    </>
  );
}

Meals.propTypes = {
  /** userId of user whose meals are to be displayed */
  userId: string,
  /** are these the user's own meals or is another user watching foreign meals? In the latter case editing will be prohibited. */
  own: bool.isRequired,
}

export default withLoginRequired(Meals);
