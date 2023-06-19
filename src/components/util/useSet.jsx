import { useState } from "react";

export function useSet() {
  const [set, setSet] = useState(new Set());

  /**
   * Add element(s) to the set
   * @param {string | Array} valueToAdd can be either string or Array of strings to add
   */
  const updateSet = (valueToAdd) => {
    const valuesToAdd = Array.isArray(valueToAdd) ? valueToAdd : [valueToAdd];
    setSet(prevState => new Set([...prevState, ...valuesToAdd]));
  }

  const clearSet = () => {
    setSet(new Set());
  }

  return [set, updateSet, clearSet];
}
