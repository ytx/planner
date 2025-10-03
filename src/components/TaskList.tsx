import type { Task } from '../types/index.ts';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';

interface TaskListProps {
  tasks: Task[];
  listType: 'today' | 'tomorrow';
}

const TaskList = ({ tasks, listType }: TaskListProps) => {
  return (
    <div className="task-list-wrapper">
      <AddTaskForm listType={listType} />
      <div className="task-list">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} listType={listType} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
