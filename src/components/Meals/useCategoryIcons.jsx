import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { getSettingsOfUser } from "../Settings/settings.util";

export default function useCategoryIcons() {
  const { user } = useAuth0();

  const [allCategories, setAllCategories] = useState([]);
  const [allCategoryIcons, setAllCategoryIcons] = useState({});
  const [categoriesChanged, setCategoriesChanged] = useState(false);

  useEffect(() => {
    if (user) {
      const userId = user.sub;
      getSettingsOfUser(userId, (settings) => {
        setAllCategories(settings.mealCategories || []);
        setCategoriesChanged(false);
      });
    }
  }, [user, categoriesChanged]);

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