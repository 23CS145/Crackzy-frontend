import { Link } from 'react-router-dom';

const CategoryCard = ({ category, count, icon }) => {
  const categoryIcons = {
    RBI: '🏦',
    SBI: '💰',
    IBPS: '🏛️',
    RRB: '🚂',
    SSC: '📚',
    UPSC: '🎓',
    General: '📝'
  };

  return (
    <Link to={`/tests/category/${category.toLowerCase()}`} className="category-card">
      <div className="category-icon">
        {icon || categoryIcons[category] || '📋'}
      </div>
      <h3>{category}</h3>
      <p>{count} {count === 1 ? 'Test' : 'Tests'}</p>
    </Link>
  );
};

export default CategoryCard;