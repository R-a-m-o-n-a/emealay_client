import { useState } from "react";

export function useMap() {
  const [map, setMap] = useState(new Map());

  const updateMap = (k, v) => {
    setMap(new Map(map.set(k, v)));
  }

  const clearMap = () => {
    setMap(new Map());
  }

  return [map, updateMap, clearMap];
}
