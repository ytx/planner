import { useAppContext } from '../contexts/AppContext';

const HistoryViewer = () => {
  const { state } = useAppContext();
  const { history } = state;

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(history).sort((a, b) => b.localeCompare(a));

  return (
    <div className="history-viewer">
      {sortedDates.length === 0 ? (
        <p>履歴はありません。</p>
      ) : (
        sortedDates.map(date => (
          <div key={date} className="history-day">
            <h3>{date}</h3>
            <ul className="history-task-list">
              {history[date].map(task => (
                <li key={task.id} className="history-task-item">
                  <span className="history-task-title">{task.title}</span>
                  {task.workTime !== undefined && task.workTime > 0 && (
                    <span className="history-task-worktime">{Math.floor(task.workTime / 60)}h {task.workTime % 60}m</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryViewer;
