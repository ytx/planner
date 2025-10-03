import React, { useState, useRef, useEffect } from 'react';
import type { Task } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface TaskItemProps {
  task: Task;
  listType: 'today' | 'tomorrow';
}

const TaskItem = ({ task, listType }: TaskItemProps) => {
  const { state, dispatch } = useAppContext();
  const { categories } = state.settings;
  const [showContextMenu, setShowContextMenu] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'ー'; // 未処理
      case 'in-progress': return '◐'; // 作業中
      case 'paused': return '×'; // 中断
      case 'done': return '✓'; // 完了
      default: return '❓';
    }
  };

  const getStatusColorClass = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'status-color-todo';
      case 'in-progress': return 'status-color-in-progress';
      case 'paused': return 'status-color-paused';
      case 'done': return 'status-color-done';
      default: return '';
    }
  };

  const handleStatusAction = () => {
    let updatedTask: Task = { ...task };
    const now = Date.now();

    switch (task.status) {
      case 'todo': // 未着手 -> 作業中
        updatedTask = { ...task, status: 'in-progress', startTime: now };
        break;
      case 'in-progress': // 作業中 -> 中断中
        if (task.startTime) {
          const segmentDuration = Math.floor((now - task.startTime) / (1000 * 60)); // minutes
          updatedTask.workTime = (updatedTask.workTime || 0) + segmentDuration;
        }
        updatedTask = { ...updatedTask, status: 'paused', startTime: undefined, endTime: now };
        break;
      case 'paused': // 中断中 -> 作業中
        updatedTask = { ...task, status: 'in-progress', startTime: now };
        break;
      case 'done': // 完了 -> 作業中 (再開)
        updatedTask = { ...task, status: 'in-progress', startTime: now };
        break;
    }
    dispatch({ type: 'UPDATE_TASK', payload: { updatedTask, list: listType } });
  };

  const handleComplete = () => {
    const now = Date.now();
    let totalWorkTime = task.workTime || 0;

    if (task.status === 'in-progress' && task.startTime) {
      const segmentDuration = Math.floor((now - task.startTime) / (1000 * 60)); // minutes
      totalWorkTime += segmentDuration;
    }

    dispatch({ type: 'OPEN_WORK_TIME_ADJUSTMENT', payload: { taskId: task.id, initialWorkTime: totalWorkTime, listType } });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = e.target.value === '' ? undefined : e.target.value;
    const updatedTask = { ...task, categoryId: newCategoryId };
    dispatch({ type: 'UPDATE_TASK', payload: { updatedTask, list: listType } });
  };

  const handleDelete = () => {
    if (window.confirm(`タスク「${task.title}」を削除しますか？`)) {
      dispatch({ type: 'DELETE_TASK', payload: { taskId: task.id, list: listType } });
    }
    setShowContextMenu(false);
  };

  const handleMoveToToday = () => {
    dispatch({ type: 'MOVE_TASK_TO_TODAY', payload: { taskId: task.id } });
    setShowContextMenu(false);
  };

  const handleMoveToTomorrow = () => {
    dispatch({ type: 'MOVE_TASK_TO_TOMORROW', payload: { taskId: task.id } });
    setShowContextMenu(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default browser context menu
    setShowContextMenu(true);
    // Position context menu (simple example, can be improved)
    if (contextMenuRef.current) {
      contextMenuRef.current.style.top = `${e.clientY}px`;
      contextMenuRef.current.style.left = `${e.clientX}px`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const taskBackgroundColor = task.categoryId
    ? categories.find(cat => cat.id === task.categoryId)?.color + '33' // 33 for 20% opacity
    : undefined;

  return (
    <div
      className={`task-item status-${task.status}`}
      onContextMenu={handleContextMenu}
      style={{ backgroundColor: taskBackgroundColor }}
    >
      {listType === 'tomorrow' && (
        <button onClick={handleMoveToToday} className="move-to-today-btn" title="今日のタスクへ移動">
          ←
        </button>
      )}

      {listType === 'today' && (
        <button onClick={handleStatusAction} className={`status-icon-btn ${getStatusColorClass(task.status)}`} title={task.status}>
          {getStatusIcon(task.status)}
        </button>
      )}

      <span className="task-title">{task.title}</span>

      {listType === 'today' && task.status === 'in-progress' && (
        <button onClick={handleComplete} className="complete-btn" title="完了">
          ✅
        </button>
      )}

      <select value={task.categoryId || ''} onChange={handleCategoryChange} className="task-category-select">
        <option value="">分類なし</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {listType === 'today' && (
        <button onClick={handleMoveToTomorrow} className="move-to-tomorrow-btn" title="明日以降のタスクへ移動">
          →
        </button>
      )}

      {showContextMenu && (
        <div ref={contextMenuRef} className="context-menu">
          <button onClick={handleDelete}>削除</button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;