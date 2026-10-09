import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('vp_theme', 'dark');
  }, []);

  const toggleTheme = () => {};

  return { theme: 'dark', setTheme, toggleTheme };
}
