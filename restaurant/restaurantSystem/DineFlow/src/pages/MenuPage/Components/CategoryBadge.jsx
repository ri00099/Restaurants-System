import React from 'react';
import '../../../style/MenuPage/CategoryBadge.css';

const CategoryBadge = ({ category }) => {
  const getClassName = () => {
    switch(category) {
      case 'Main Courses':
        return 'badge-main-courses';
      case 'Appetizers':
        return 'badge-appetizers';
      case 'Desserts':
        return 'badge-desserts';
      case 'Beverages':
        return 'badge-beverages';
      default:
        return 'badge-default';
    }
  };
  
  return (
    <span className={`category-badge ${getClassName()}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;