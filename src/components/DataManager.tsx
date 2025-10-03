import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { AppData } from '../types/index.ts';

const DataManager = () => {
  const { state, dispatch } = useAppContext();
  const [dataJson, setDataJson] = useState('');

  const handleExport = () => {
    // Create a copy of the state and ensure the modal is closed in the exported data
    const stateToExport = { ...state, settings: { ...state.settings, isSettingsModalOpen: false } };
    const jsonString = JSON.stringify(stateToExport, null, 2); // Pretty print JSON
    setDataJson(jsonString);
  };

  const handleImport = () => {
    if (!window.confirm('現在のすべてのデータを上書きします。よろしいですか？')) {
      return;
    }
    try {
      const newData: AppData = JSON.parse(dataJson);
      // Basic validation to ensure the data structure is correct
      if (newData.settings && newData.tasks && newData.history) {
        dispatch({ type: 'IMPORT_DATA', payload: newData });
        alert('データのインポートが完了しました。');
      } else {
        throw new Error('無効なデータ形式です。');
      }
    } catch (error) {
      console.error('Import failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`インポートに失敗しました。JSONの形式を確認してください。\n${errorMessage}`);
    }
  };

  return (
    <div className="data-manager">
      <p>現在の全データをJSON形式で入出力します。</p>
      <div className="data-buttons">
        <button onClick={handleExport}>エクスポート</button>
        <button onClick={handleImport} disabled={!dataJson.trim()}>インポート</button>
      </div>
      <textarea
        value={dataJson}
        onChange={(e) => setDataJson(e.target.value)}
        placeholder="エクスポートボタンを押すとここにデータが表示されます。インポートする場合は、データを貼り付けてインポートボタンを押してください。"
        rows={15}
      />
    </div>
  );
};

export default DataManager;
