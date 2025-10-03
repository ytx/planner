import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import type { Category } from '../types/index.ts';

const colorPalette = [
  '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB', '#B3E5FC', '#B2EBF2',
  '#B2DFDB', '#C8E6C9', '#DCEDC8', '#F0F4C3', '#FFF9C4', '#FFECB3', '#FFE0B2', '#FFCCBC',
];

const CategoryManager = () => {
  const { state, dispatch } = useAppContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(colorPalette[0]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newCategory = { id: uuidv4(), name: newCategoryName.trim(), color: newCategoryColor };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    setNewCategoryName('');
    setNewCategoryColor(colorPalette[0]);
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
        <div className="color-palette">
          {colorPalette.map((color) => (
            <div
              key={color}
              className={`color-box ${newCategoryColor === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setNewCategoryColor(color)}
            />
          ))}
        </div>
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
              <span className="category-name-display" style={{ backgroundColor: cat.color, color: 'black' }}>{cat.name}</span>
            )}

            {editingCategory?.id === cat.id ? (
              <div className="category-actions">
                <div className="color-palette">
                  {colorPalette.map((color) => (
                    <div
                      key={color}
                      className={`color-box ${editingCategory.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingCategory({ ...editingCategory, color: color })}
                    />
                  ))}
                </div>
                <button onClick={handleUpdateCategory}>保存</button>
                <button onClick={() => setEditingCategory(null)}>キャンセル</button>
              </div>
            ) : (
              <div className="category-actions">
                <button onClick={() => setEditingCategory(cat)}>編集</button>
                <button onClick={() => handleDeleteCategory(cat.id)}>削除</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;