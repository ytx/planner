import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import ThemeToggle from './ThemeToggle';
import SettingsIcon from './icons/SettingsIcon';

const Header = () => {
  const { state, dispatch } = useAppContext();

  const openSettings = () => {
    dispatch({ type: 'OPEN_SETTINGS_MODAL' });
  };

  const advanceDate = () => {
    if (window.confirm(`${state.settings.currentDate} の作業を終了し、次の日に進めますか？\n- 完了したタスクは履歴に記録されます。\n- 未完了のタスクは次の日に持ち越されます。`)) {
      dispatch({ type: 'ADVANCE_DATE' });
    }
  };

  return (
    <header className="app-header">
      <h1>Planner</h1>
      <div className="header-controls">
        <span>{state.settings.currentDate}</span>
        <button onClick={advanceDate}>日付を進める</button>
        <ThemeToggle />
        <button onClick={openSettings} title="Settings" className="icon-button">
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
