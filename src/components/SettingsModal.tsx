import { useAppContext } from '../contexts/AppContext';
import SettingsTabs from './SettingsTabs';

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
          <SettingsTabs />
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
