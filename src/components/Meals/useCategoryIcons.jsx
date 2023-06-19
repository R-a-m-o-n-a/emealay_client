import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useMemo, useState } from "react";
import { getSettingsOfUser } from "../Settings/settings.util";

export default function useCategoryIcons(foreignUserId = undefined) {
  const { user } = useAuth0();

  const [userId, setUserId] = useState(foreignUserId);
  const [allCategories, setAllCategories] = useState([]);
  const [categoriesChanged, setCategoriesChanged] = useState(false);

  useEffect(() => {
    if (userId) {
      getSettingsOfUser(userId, (settings) => {
        setAllCategories(settings.mealCategories || []);
        setCategoriesChanged(false);
      });
    }
  }, [userId, categoriesChanged]);

  useEffect(() => {
    if (!foreignUserId) {
      if (user) {
        setUserId(user.sub);
      }
    } else {
      setUserId(foreignUserId);
    }
  }, [foreignUserId, user]);

  // convert category array into an object with all category names as keys with the structure categoryName: categoryIcon
  const allCategoryIcons = useMemo(() => {
    if (allCategories.length > 0) {
      return allCategories.reduce((accumulator, c) => {
        return { ...accumulator, [c.name]: c.icon };
      }, {}); // the initial value {} is necessary for the reducer to start at index 0 instead of index 1
    } else {
      return {};
    }
  }, [allCategories]);

  const reload = () => {
    setCategoriesChanged(true);
  }

  return [allCategoryIcons, reload];
}
