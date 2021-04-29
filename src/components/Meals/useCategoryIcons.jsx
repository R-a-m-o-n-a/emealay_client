import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { getSettingsOfUser } from "../Settings/settings.util";

export default function useCategoryIcons(foreignUserId = undefined) {
  const { user } = useAuth0();

  const [userId, setUserId] = useState(foreignUserId);
  const [allCategories, setAllCategories] = useState([]);
  const [allCategoryIcons, setAllCategoryIcons] = useState({});
  const [categoriesChanged, setCategoriesChanged] = useState(false);

  useEffect(() => {
    getSettingsOfUser(userId, (settings) => {
      setAllCategories(settings.mealCategories || []);
      setCategoriesChanged(false);
    });
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

  useEffect(() => {
    allCategories.forEach(c => {
      setAllCategoryIcons(prevState => ({
        ...prevState,
        [c.name]: c.icon,
      }));
    });
  }, [allCategories]);

  const reload = () => {
    setCategoriesChanged(true);
  }

  return [allCategoryIcons, reload];
}
