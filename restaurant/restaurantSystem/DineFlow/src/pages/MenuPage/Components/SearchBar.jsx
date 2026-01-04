import React from "react";
import "../../../style/MenuPage/SearchBar.css";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="searchbar-wrapper">
      <input
        type="text"
        className="searchbar-input"
        placeholder="Search for dishes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;