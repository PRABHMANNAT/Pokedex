import { useCallback, useEffect, useState } from 'react';
import { readStored, writeStored } from '../lib/storage';

const KEY = 'pokedex:collection:v1';
const validIds = (value) =>
  Array.isArray(value) && value.every((id) => Number.isInteger(id) && id >= 1 && id <= 1025);
export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => readStored(KEY, [], validIds));
  const toggleFavorite = useCallback(
    (id) =>
      setFavorites((current) =>
        current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
      ),
    [],
  );
  useEffect(() => {
    writeStored(KEY, favorites);
  }, [favorites]);
  useEffect(() => {
    const sync = (event) => {
      if (event.key === KEY) setFavorites(readStored(KEY, [], validIds));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  return { favorites, toggleFavorite };
}
