import { useAppContext } from '../contexts/AppContext';
import CategoryManager from './CategoryManager';
import DataManager from './DataManager';

const SettingsModal = () => {
  const { state, dispatch } = useAppContext();

  if (!state.settings.isSettingsModalOpen) {
    return null;
  }

  const handleClose = () => {
    dispatch({ type: 'CLOSE_SETTINGS_MODAL' });
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>設定</h2>
          <button onClick={handleClose} className="close-btn">&times;</button>
        </div>
        <div className="modal-body">
          <section>
            <h3>分類の管理</h3>
            <CategoryManager />
          </section>
          <section>
            <h3>データ管理</h3>
            <DataManager />
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
