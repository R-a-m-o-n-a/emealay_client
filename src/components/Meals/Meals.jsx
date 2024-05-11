import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { alpha, Box, Button, Collapse, Divider, Grid, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { ExpandLess, ExpandMore, UnfoldLess, UnfoldMore } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { fetchAndUpdateMealsFromUser } from "./meals.util";
import useCategoryIcons from "./useCategoryIcons";
import { bool, string } from "prop-types";
import MealAvatar from "./MealAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectMealTags from "./SelectMealTags";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingBody } from "../Loading";
import { faHourglass, faHourglassEnd, faHourglassStart } from "@fortawesome/free-solid-svg-icons";
import TriStateIconSwitch from "../util/TriStateIconSwitch";
import { useTracking } from "react-tracking";

const useStyles = makeStyles(theme => ({
  infoText: {
    textAlign: "center",
    margin: "3rem 2rem",
    fontFamily: "Neucha",
    fontSize: "1.3rem",
    lineHeight: "1.4rem",
  },
  category: props => ({
    backgroundColor: alpha(props.own ? theme.palette.primary.main : theme.palette.secondary.main, 0.1),
    '&:hover': {
      backgroundColor: alpha(props.own ? theme.palette.primary.main : theme.palette.secondary.main, 0.2),
    }
  }),
  listItemIcon: {
    fontSize: "1rem",
    color: theme.palette.text.primary,
    minWidth: '2rem',
  },
  nestedListItem: {
    paddingLeft: theme.spacing(4),
  },
  isToTryDot: props => ({
    //backgroundColor: alpha(props.own ? theme.palette.primary.main : theme.palette.secondary.main, 0.5),
    color: alpha(props.own ? theme.palette.primary.main : theme.palette.secondary.main, 0.5),
    fontSize: "0.6rem",
    position: "absolute",
    left: "16px",
    transform: "translate(-50%)",
  }),
  controlBox: {
    height: '50px',
    padding: '5px',
  },
  filterBox: {
    padding: '10px',
    marginTop: '-15px',
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

/** Content of page that displays all meals of a given use and opens their detail views on click.
 * If meals belong to logged in user, editing will be allowed.
 * todo: add search in addition to filters */
const Meals = (props) => {
  const classes = useStyles(props);
  const { own, userId } = props;

  const { t } = useTranslation();
  let navigate = useNavigate();
  const { Track, trackEvent } = useTracking({ page: own ? 'own-meals' : 'foreign-meals' });

  const { pathname, state } = useLocation();

  const [isFilterOpen, setIsFilterOpen] = useState(state?.activeMealFilter?.isFilterOpen ?? false);
  const [filterTags, setFilterTags] = useState(state?.activeMealFilter?.filterTags ?? []);
  const [filterForToTry, setFilterForToTry] = useState(state?.activeMealFilter?.filterForToTry ?? 0);
  const [meals, setMeals] = useState(state?.activeMealFilter?.filteredMeals ?? []); // take state-cached meals while loading takes place in background -> no apparent loading for user
  const [isCategoryOpen, setIsCategoryOpen] = useState({});
  const [categoryIcons, fireIconReload] = useCategoryIcons(userId);
  const [emptyListFound, setEmptyListFound] = useState(false);

  // get all categories that are in use (uniquely, without null values)
  const usedCategories = useMemo(() => Array.from(new Set(meals.map(meal => meal.category).filter(cat => cat))), [meals]);

  const updateIsCategoryOpen = (key, value) => {
    setIsCategoryOpen(prevState => {return { ...prevState, [key]: value }});
  }

  const fetchAndUpdateMeals = () => {
    fetchAndUpdateMealsFromUser(userId, (mealsFound) => {
      setMeals(mealsFound);
      if (mealsFound.length === 0) {
        setEmptyListFound(true);
      }
    });
    fireIconReload();
  }

  useEffect(() => {
    fetchAndUpdateMeals();
  }, [userId, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state?.refresh === true) { // force reload meals after undoing deletion and then remove refresh from state
    fetchAndUpdateMeals();
    delete state.refresh;
    navigate(pathname, { replace: true, state: { ...state } });
  }

  // filter meals according to tag filter
  let filteredMeals = useMemo(() => {
    let returnMeals = meals;
    if (filterTags.length > 0) { // filter by tags
      returnMeals = meals.filter(meal => {
        if (!meal.tags || meal.tags.length === 0) return false; // do not include meals without tags -> they cannot correspond with any set filter
        return filterTags.every(tag => meal.tags.includes(tag));
      });
    }
    if (filterForToTry === 1) {
      returnMeals = returnMeals.filter(meal => meal.isToTry === true);
    } else if (filterForToTry === -1) {
      returnMeals = returnMeals.filter(meal => meal.isToTry !== true);
    }
    return returnMeals;
  }, [meals, filterTags, filterForToTry]);

  const sortedCategories = useMemo(() => {
    // sort categories alphabetically
    const sorted = [...usedCategories.sort(function (a, b) { return a > b ? 1 : -1; })]; // deep copy to avoid adding meals without category to original usedCategories

    // add a category for meals without category, if there are any
    const mealsWithoutCategory = filteredMeals.filter(meal => !meal.category);
    if (mealsWithoutCategory.length > 0) {
      sorted.push(t('Meals without category'));
    }

    return sorted;
  }, [filteredMeals, usedCategories, t]);

  // sort meals into categories
  const mealsByCategory = useMemo(() => {
    const mealsByCat = new Map();

    // for each category in use, get all corresponding meals and add them to the map
    sortedCategories.forEach(category => {
      const mealsInCategory = filteredMeals.filter(meal => {
        if (!meal.category) {
          return category === t('Meals without category');
        }
        return meal.category === category;
      });
      mealsByCat.set(category, mealsInCategory);
    });
    return mealsByCat;
  }, [filteredMeals, sortedCategories, t]);

  // set all categories to be initially open
  if (meals.length > 0 && Object.keys(isCategoryOpen).length === 0) { // only do this after meals have been loaded, otherwise it results in an infinite loop
    const categoriesInitiallyExpanded = true;

    const categoriesOpenObject = sortedCategories.reduce((accumulator, catName) => {
      return { ...accumulator, [catName]: categoriesInitiallyExpanded };
    }, {}); // the initial value {} is necessary for the reducer to start at index 0 instead of index 1

    setIsCategoryOpen(categoriesOpenObject);
  }

  const openMealDetailView = (meal) => {
    const activeMealFilter = {
      filteredMeals,
      filterTags,
      isFilterOpen,
    };
    // set the active meal filter in the state of the current location before navigating away, because it will be restored when navigating back from the detail view with navigate(-1)
    navigate(pathname, { replace: true, state: { activeMealFilter } });
    if (own) {
      navigate('detail/' + meal._id, { state: { meal } });
    } else {
      navigate('/meals/detail/' + meal._id, { state: { meal, mealContext: 'social' } });
    }
  };

  const updateFilterTags = (newTags) => {
    trackEvent({ event: 'use-filters', appliedTags: newTags });
    setFilterTags(newTags);
  }

  const toggleAllCategories = () => {
    let allClosed = Object.values(isCategoryOpen).every(isOpen => !isOpen);
    trackEvent({ module: 'toggle-all-categories', event: allClosed ? 'expand' : 'collapse' });
    Object.keys(isCategoryOpen).forEach(category => {
      updateIsCategoryOpen(category, allClosed);
    });
  }

  const toggleFilter = () => {
    setIsFilterOpen(prevState => {
      trackEvent({ module: 'meal-filter', event: prevState === false ? 'open' : 'close' });
      return !prevState;
    });
  }

  const areAllCategoriesClosed = useMemo(() => Object.values(isCategoryOpen).every(isOpen => isOpen === false), [isCategoryOpen]);

  const getListItems = () => {
    const listItems = [];
    mealsByCategory.forEach((meals, categoryName) => {
      if (meals.length > 0) { // only show categories with meals inside (when filtering otherwise empty categories will be displayed
        const listItemsForCategory = [];
        meals.forEach(meal => {
          listItemsForCategory.push(
            <ListItem key={meal._id} className={classes.nestedListItem} button onClick={() => {openMealDetailView(meal); }}>
              {meal.isToTry ? <Box className={classes.isToTryDot}><FontAwesomeIcon icon={faHourglassStart} /></Box> : ''}
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
          }} className={classes.category}>
            {icon && <ListItemIcon className={classes.listItemIcon}>
              <FontAwesomeIcon icon={icon} />
            </ListItemIcon>}
            <ListItemText>{categoryName}</ListItemText>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>,
          <Collapse key={categoryName + 'MealList'} in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {listItemsForCategory}
            </List>
          </Collapse>);
      }
    });
    return listItems;
  }

  let infoText = t("Looks like there are no meals here yet.");
  if (own) infoText += ' ' + t('Add one by clicking in the top right corner.');

  if (meals.length === 0) {
    return (
      emptyListFound ? <Typography className={classes.infoText}>{infoText}</Typography> : <LoadingBody />
    );
  } else {
    return (
      <Track>
        <Box className={classes.controlBox} style={{ display: 'flex', justifyContent: own ? 'space-between' : 'end' }}>
          <Button variant="text" className={classes.optionRowButton} color="secondary" onClick={toggleFilter} endIcon={isFilterOpen ? <ExpandLess /> : <ExpandMore />}>
            {t('Filter')}
          </Button>
          <Button variant="text"
                  className={classes.optionRowButton}
                  style={{ marginLeft: 'auto' }}
                  color="primary"
                  endIcon={areAllCategoriesClosed ? <UnfoldMore /> : <UnfoldLess />}
                  onClick={toggleAllCategories}>
            {areAllCategoriesClosed ? t('expand all') : t('collapse all')}
          </Button>
        </Box>
        {isFilterOpen && <Box className={classes.filterBox}>

          <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: "0.5rem" }}>
            <Grid item style={{ width: "calc(100% - 72px)" }}>
              <SelectMealTags currentTags={filterTags}
                              own={own}
                              otherUserId={userId}
                              updateTags={updateFilterTags}
                              placeholderText={t('Filter by Tags')}
                              className={classes.filterTags}
                              customControlStyles={{ borderRadius: 0 }} />
            </Grid>
            <Grid item style={{ width: "65px" }}>
              <TriStateIconSwitch IconLeft={FontAwesomeIcon}
                                  IconMiddle={FontAwesomeIcon}
                                  IconRight={FontAwesomeIcon}
                                  iconLeftProps={{ icon: faHourglassEnd }}
                                  iconMiddleProps={{ icon: faHourglass }}
                                  iconRightProps={{ icon: faHourglassStart }}
                                  value={filterForToTry}
                                  setValue={setFilterForToTry}
                                  color={"primary"} />
            </Grid>
          </Grid>
        </Box>
        }
        {filteredMeals.length === 0
          ?
          <Typography className={classes.infoText}>{t('No meals found for filter selection')}</Typography>
          :
          <List component="nav" className={classes.root} aria-label="meal list" disablePadding>
            {getListItems()}
          </List>}
      </Track>
    );
  }
}

Meals.propTypes = {
  /** userId of user whose meals are to be displayed */
  userId: string.isRequired,
  /** are these the user's own meals or is another user watching foreign meals? In the latter case editing will be prohibited. */
  own: bool.isRequired,
}

export default Meals;
