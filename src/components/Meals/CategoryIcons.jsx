import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGoogle, faPinterest, faYoutube } from '@fortawesome/free-brands-svg-icons';

const solidIconNames = [
  'apple-alt',
  'carrot',
  'pepper-hot',
  'lemon',
  'fish', 'bacon', 'drumstick-bite', 'hamburger', 'hotdog', 'bone',
  'pizza-slice',
  'bread-slice', 'cheese', 'egg',
  'ice-cream', 'birthday-cake', 'cookie', 'cookie-bite', 'candy-cane', 'stroopwafel',
  'coffee', 'mug-hot', 'wine-bottle', 'wine-glass-alt', 'beer', 'cocktail', 'glass-martini-alt', 'glass-cheers', 'glass-whiskey',
  'mortar-pestle', 'blender', 'utensils', 'utensil-spoon',
  'concierge-bell',
  'seedling', 'leaf', 'holly-berry',
  'heart', 'heartbeat',
  'grin-tongue-squint', 'grin-stars', 'grin-tongue', 'grin-hearts', 'grin-beam-sweat',
  'crown',
  'brain',
  'balance-scale', 'balance-scale-right', 'weight',
  'shopping-cart', 'shopping-basket', 'shopping-bag',
  'globe-africa', 'globe-americas', 'globe-asia', 'globe-europe',
  'snowflake', 'snowman', 'fire', 'thermometer-empty', 'thermometer-quarter', 'thermometer-half', 'thermometer-three-quarters', 'thermometer-full',
  'book', 'bookOpen',
  'disease',
  'tag', 'tags', 'thumbtack',
  'percent',
  'user-friends', 'users', 'user', 'user-tie', 'user-nurse', 'user-graduate', 'user-check',
  'hands-helping',
  'houseUser', 'home', 'caravan', 'hotel', 'building',
  'umbrella-beach', 'car', 'suitcase-rolling', 'suitcase', 'plane',
  'place-of-worship', 'praying-hands', 'pray',
  'spa', 'dumbbell', 'walking', 'running', 'hiking', 'biking', 'swimmer',
  'newspaper', 'theater-masks',
  'baby-carriage', 'baby', 'child',
  'dog', 'cat'];

function sortFunction(a, b) { // icons will get sorted in the order they appear in the list above
  return solidIconNames.indexOf(a.iconName) < solidIconNames.indexOf(b.iconName) ? -1 : 1;
}

/** contains all fontawesome icons in the order specified above to be used by other components */
const categoryIcons = Object.values(SolidIcons)
                            .filter(i => solidIconNames.includes(i.iconName))
                            .sort(sortFunction);
categoryIcons.push(faYoutube, faPinterest, faGoogle, faFacebook);

export default categoryIcons;
