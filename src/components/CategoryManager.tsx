import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import type { Category } from '../types/index.ts';

const CategoryManager = () => {
  const { state, dispatch } = useAppContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newCategory = { id: uuidv4(), name: newCategoryName.trim() };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('この分類を削除しますか？関連するタスクの分類は解除されます。')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: { id } });
    }
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    dispatch({ type: 'UPDATE_CATEGORY', payload: editingCategory });
    setEditingCategory(null);
  };

  return (
    <div className="category-manager">
      <form onSubmit={handleAddCategory} className="category-add-form">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="新しい分類名"
        />
        <button type="submit">追加</button>
      </form>

      <ul className="category-list">
        {state.settings.categories.map((cat) => (
          <li key={cat.id} className="category-list-item">
            {editingCategory?.id === cat.id ? (
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, name: e.target.value })
                }
                autoFocus
              />
            ) : (
              <span>{cat.name}</span>
            )}

            <div className="category-actions">
              {editingCategory?.id === cat.id ? (
                <>
                  <button onClick={handleUpdateCategory}>保存</button>
                  <button onClick={() => setEditingCategory(null)}>キャンセル</button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditingCategory(cat)}>編集</button>
                  <button onClick={() => handleDeleteCategory(cat.id)}>削除</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
