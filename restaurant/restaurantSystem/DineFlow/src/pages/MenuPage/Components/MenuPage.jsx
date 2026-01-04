import React, { useState, useMemo } from "react";
import "../../../style/MenuPage/MenuPage.css";

import CategoryFilters from "./CategoryFilters";
import SearchBar from "./SearchBar";
import MenuGrid from "./MenuGrid";
import QuickViewModal from "./QuickViewModal";

import { menuItems } from "./data";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = useMemo(() => {
    let items = menuItems;

    if (selectedCategory !== "All") {
      items = items.filter((i) => i.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items;
  }, [selectedCategory, searchTerm]);

  const handleAddToCart = (item) => {
    alert(`Added ${item.name} to cart.`);
  };

  return (
    <div className="menu-page">
      <h1 className="menu-heading">Our Delicious Menu</h1>
      <p className="menu-subheading">
        Explore a wide variety of fresh and crafted dishes.
      </p>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <CategoryFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <MenuGrid
        filteredItems={filteredItems}
        handleQuickView={setSelectedItem}
        handleAddToCart={handleAddToCart}
      />

      <QuickViewModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default MenuPage;