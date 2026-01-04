import React from "react";
import "../../../style/MenuPage/CategoryFilters.css";

const categories = ["All", "Starters", "Main Course", "Desserts", "Beverages"];

const CategoryFilters = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="filters-container">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-btn ${
            selectedCategory === cat ? "active" : ""
          }`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;