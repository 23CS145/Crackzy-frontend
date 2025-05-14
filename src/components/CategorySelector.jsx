import { Link } from 'react-router-dom';

const CategorySelector = ({ categories, basePath, currentCategory }) => {
  return (
    <div className="category-selector">
      <div className="category-list">
        <Link 
          to={basePath} 
          className={`category-item ${!currentCategory ? 'active' : ''}`}
        >
          All Categories
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            to={`${basePath}/category/${category.toLowerCase()}`}
            className={`category-item ${currentCategory === category.toLowerCase() ? 'active' : ''}`}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;