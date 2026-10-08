import { useEffect, useState } from 'react';
import { readStored, writeStored } from '../lib/storage';

export default function useTheme() {
  const [theme, setTheme] = useState(() =>
    readStored(
      'pokedex:theme:v1',
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      (value) => ['dark', 'light'].includes(value),
    ),
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStored('pokedex:theme:v1', theme);
  }, [theme]);
  return {
    theme,
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
  };
}
