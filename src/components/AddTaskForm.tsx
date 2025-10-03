import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';

interface AddTaskFormProps {
  listType: 'today' | 'tomorrow';
}

const AddTaskForm = ({ listType }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const { state, dispatch } = useAppContext();
  const { categories } = state.settings;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: uuidv4(),
      title,
      status: 'todo' as const,
      createdAt: Date.now(),
      categoryId: selectedCategoryId || undefined,
    };

    dispatch({ type: 'ADD_TASK', payload: { task: newTask, list: listType } });
    setTitle('');
    setSelectedCategoryId('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを追加..."
      />
      <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="task-category-select">
        <option value="">分類なし</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button type="submit">追加</button>
    </form>
  );
};

export default AddTaskForm;
