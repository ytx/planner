import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import { useAppContext } from '../contexts/AppContext';

interface TaskListProps {
  // tasks: Task[]; // Removed
  listType: 'today' | 'tomorrow';
}

const TaskList = ({ listType }: TaskListProps) => {
  const { state } = useAppContext();
  const { activeCategoryFilter } = state.settings;

  const allTasks = state.tasks[listType]; // Get tasks directly from global state

  const filteredTasks = activeCategoryFilter
    ? allTasks.filter(task => task.categoryId === activeCategoryFilter)
    : allTasks;

  return (
    <div className="task-list-wrapper">
      <AddTaskForm listType={listType} />
      <div className="task-list">
        {filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} listType={listType} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;