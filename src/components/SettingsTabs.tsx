import { useState } from 'react';
import CategoryManager from './CategoryManager';
import DataManager from './DataManager';
import AboutTab from './AboutTab';
import HistoryViewer from './HistoryViewer'; // Import HistoryViewer

type Tab = 'categories' | 'data' | 'about' | 'history'; // Add 'history' tab

const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState<Tab>('categories');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoryManager />;
      case 'data':
        return <DataManager />;
      case 'about':
        return <AboutTab />;
      case 'history': // Render HistoryViewer for 'history' tab
        return <HistoryViewer />;
      default:
        return null;
    }
  };

  return (
    <div className="settings-tabs">
      <div className="tab-buttons">
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          分類
        </button>
        <button
          className={activeTab === 'data' ? 'active' : ''}
          onClick={() => setActiveTab('data')}
        >
          データ管理
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          履歴
        </button>
        <button
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SettingsTabs;