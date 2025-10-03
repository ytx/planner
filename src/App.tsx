import { useAppContext } from './contexts/AppContext';
import Header from './components/Header';
import TaskList from './components/TaskList';
import SettingsModal from './components/SettingsModal';
import WorkTimeAdjustmentModal from './components/WorkTimeAdjustmentModal';

function App() {
  const { state } = useAppContext();

  return (
    <div id="app" className={state.settings.theme}>
      <Header />
      <main className="main-content">
        <section className="task-section">
          <h2>今日のタスク</h2>
          <TaskList tasks={state.tasks.today} listType="today" />
        </section>
        <section className="task-section">
          <h2>明日以降のタスク</h2>
          <TaskList tasks={state.tasks.tomorrow} listType="tomorrow" />
        </section>
      </main>
      <SettingsModal />
      <WorkTimeAdjustmentModal />
    </div>
  );
}

export default App;
