import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

const ThemeToggle = () => {
  const { state, dispatch } = useAppContext();

  const toggleTheme = () => {
    const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };

  return (
    <button onClick={toggleTheme} className="theme-toggle-btn icon-button" title="Toggle theme">
      {state.settings.theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default ThemeToggle;
