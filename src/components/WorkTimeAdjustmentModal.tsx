import { useState, useEffect } from 'react';
import type { Task } from '../types/index.ts';
import { useAppContext } from '../contexts/AppContext';
import './WorkTimeAdjustmentModal.css';

const WorkTimeAdjustmentModal = () => {
  const { state, dispatch } = useAppContext();
  const { workTimeAdjustingTaskId } = state.settings;

  const [adjustedWorkTime, setAdjustedWorkTime] = useState(0);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    if (workTimeAdjustingTaskId) {
      const task = [...state.tasks.today, ...state.tasks.tomorrow].find(
        (t) => t.id === workTimeAdjustingTaskId
      );
      if (task) {
        setCurrentTask(task);
        // Calculate initial work time based on current status
        let totalWorkTime = task.workTime || 0;
        if (task.status === 'in-progress' && task.startTime) {
          const segmentDuration = Math.floor((Date.now() - task.startTime) / (1000 * 60));
          totalWorkTime += segmentDuration;
        }
        setAdjustedWorkTime(totalWorkTime);
      }
    } else {
      setCurrentTask(undefined);
    }
  }, [workTimeAdjustingTaskId, state.tasks.today, state.tasks.tomorrow]);

  if (!workTimeAdjustingTaskId || !currentTask) {
    return null;
  }

  const confirmAdjustment = () => {
    const now = Date.now();
    const updatedTask: Task = {
      ...currentTask,
      status: 'done',
      endTime: now,
      workTime: adjustedWorkTime,
      startTime: undefined, // Clear startTime once done
    };
    dispatch({ type: 'UPDATE_TASK', payload: { updatedTask, list: state.settings.workTimeAdjustingListType! } });
    dispatch({ type: 'CLOSE_WORK_TIME_ADJUSTMENT' });
  };

  const cancelAdjustment = () => {
    dispatch({ type: 'CLOSE_WORK_TIME_ADJUSTMENT' });
  };

  return (
    <div className="work-time-prompt-modal" onClick={cancelAdjustment}>
      <div className="work-time-prompt-content" onClick={(e) => e.stopPropagation()}>
        <h3>作業時間の調整</h3>
        <p>タスク: {currentTask.title}</p>
        <p>このタスクの作業時間（分）:</p>
        <input
          type="number"
          value={adjustedWorkTime}
          onChange={(e) => setAdjustedWorkTime(Number(e.target.value))}
        />
        <div className="prompt-actions">
          <button onClick={confirmAdjustment}>確定</button>
          <button onClick={cancelAdjustment}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};

export default WorkTimeAdjustmentModal;
