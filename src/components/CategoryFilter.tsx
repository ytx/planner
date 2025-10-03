import { useAppContext } from '../contexts/AppContext';

const CategoryFilter = () => {
  const { state, dispatch } = useAppContext();
  const { categories, activeCategoryFilter } = state.settings;

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filterId = e.target.value === 'all' ? null : e.target.value;
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: filterId });
  };

  return (
    <div className="category-filter">
      <select id="category-filter-select" value={activeCategoryFilter || 'all'} onChange={handleFilterChange} className="task-category-select">
        <option value="all">すべての分類</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;