import React from 'react';
import '../../../style/MenuPage/FilterBar.css';
import { Search } from 'lucide-react';

const FilterBar = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  sortBy,
  setSortBy 
}) => {
  const categories = ['All', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
  
  return (
    <div className="filter-bar">
      {/* Search Bar */}
      <div className="search-container">
        <span className="search-icon"><Search /></span>
        <input
          type="text"
          placeholder="Search for dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* Filters Container */}
      <div className="filters-container">
        {/* Category Filters */}
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="popularity">Sort by Popularity</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;