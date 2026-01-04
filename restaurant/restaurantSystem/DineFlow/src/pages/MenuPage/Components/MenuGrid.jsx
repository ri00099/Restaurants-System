import React from "react";
import FoodCard from "./FoodCard";
import "../../../style/MenuPage/MenuGrid.css";

const MenuGrid = ({ filteredItems, handleQuickView, handleAddToCart }) => {
  return (
    <div className="menu-grid">
      {filteredItems.map((item) => (
        <FoodCard
          key={item.id}
          item={item}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};

export default MenuGrid;