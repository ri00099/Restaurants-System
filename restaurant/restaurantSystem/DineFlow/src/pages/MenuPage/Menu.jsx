// import React, { useState, useMemo } from 'react';
// import { useCart } from '../../context/CartContext.jsx';
// import { useToast } from '../../components/ToastContainer';
// import '../../style/MenuPage/Menu.css';
// import FoodCard from '../MenuPage/Components/FoodCard';
// import QuickViewModal from '../MenuPage/Components/QuickViewModal';
// import FilterBar from './Components/FilterBar.jsx';
// import { menuItems } from './Components/menuData.js';

// const Menu = () => {
//   const { addToCart } = useCart();
//   const { addToast } = useToast();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [sortBy, setSortBy] = useState('popularity');
//   const [selectedItem, setSelectedItem] = useState(null);
  
//   // Filter and Sort Logic
//   const filteredItems = useMemo(() => {
//     let items = menuItems;
    
//     // Filter by category
//     if (selectedCategory !== 'All') {
//       items = items.filter(item => item.category === selectedCategory);
//     }
    
//     // Filter by search query
//     if (searchQuery) {
//       items = items.filter(item =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     // Sort items
//     items = [...items].sort((a, b) => {
//       switch (sortBy) {
//         case 'priceLowHigh':
//           return a.price - b.price;
//         case 'priceHighLow':
//           return b.price - a.price;
//         case 'rating':
//           return b.rating - a.rating;
//         case 'popularity':
//         default:
//           return b.popularity - a.popularity;
//       }
//     });
    
//     return items;
//   }, [searchQuery, selectedCategory, sortBy]);
  
//   const handleAddToCart = (item) => {
//     addToCart(item);
//     // Show toast notification
//     addToast(`${item.name} added to cart!`, 'cart');
//   };
  
//   return (
//     <div className="menu-container">
//       <div className="menu-content">
//         {/* Header */}
//         <div className="menu-header">
//           <h1 className="menu-title">Our Delicious Menu</h1>
//           <p className="menu-subtitle">
//             Explore a wide selection of dishes crafted with the freshest ingredients.
//           </p>
//         </div>
        
//         {/* Filter Bar */}
//         <FilterBar
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           selectedCategory={selectedCategory}
//           setSelectedCategory={setSelectedCategory}
//           sortBy={sortBy}
//           setSortBy={setSortBy}
//         />
        
//         {/* Results Count */}
//         <div className="results-count">
//           <p className="results-text">
//             Showing <span className="results-number">{filteredItems.length}</span> dishes
//           </p>
//         </div>
        
//         {/* Food Grid */}
//         {filteredItems.length > 0 ? (
//           <div className="food-grid">
//             {filteredItems.map((item) => (
//               <FoodCard
//                 key={item.id}
//                 item={item}
//                 onQuickView={setSelectedItem}
//                 onAddToCart={handleAddToCart}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="no-results">
//             <div className="no-results-icon">🍽️</div>
//             <h3 className="no-results-title">No dishes found</h3>
//             <p className="no-results-text">Try adjusting your search or filter criteria</p>
//           </div>
//         )}
        
//         {/* Quick View Modal */}
//         {selectedItem && (
//           <QuickViewModal
//             item={selectedItem}
//             onClose={() => setSelectedItem(null)}
//             onAddToCart={handleAddToCart}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Menu;

import React, { useState, useMemo, useEffect } from 'react'; // 1. Import useEffect
import axios from 'axios'; // 2. Import Axios
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../components/ToastContainer';
import '../../style/MenuPage/Menu.css';
import FoodCard from '../MenuPage/Components/FoodCard';
import QuickViewModal from '../MenuPage/Components/QuickViewModal';
import FilterBar from './Components/FilterBar.jsx';

// DELETE THIS LINE: import { menuItems } from './Components/menuData.js'; 

const Menu = () => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  
  // 3. NEW STATE: To store data from Backend
  const [menuItems, setMenuItems] = useState([]); 
  const [loading, setLoading] = useState(true); // To show loading screen
  const [error, setError] = useState(null);     // To show errors

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedItem, setSelectedItem] = useState(null);

  // 4. FETCH DATA: This runs once when the page loads
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // This URL must match your backend route
        const response = await axios.get('http://localhost:3000/api/menu/all');
        
        if (response.data.success) {
          setMenuItems(response.data.data); // Save the DB data to state
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Failed to load menu. Please try again later.");
      } finally {
        setLoading(false); // Stop loading whether success or fail
      }
    };

    fetchMenu();
  }, []); // Empty dependency array [] means run once on mount

  // 5. Filter and Sort Logic (Updated to use 'menuItems' state)
  const filteredItems = useMemo(() => {
    // If we are still loading, return empty
    if (loading) return [];

    let items = menuItems; // Now using the State variable, not the imported file
    
    // Filter by category
    if (selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort items
    items = [...items].sort((a, b) => {
      switch (sortBy) {
        case 'priceLowHigh':
          return a.price - b.price;
        case 'priceHighLow':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0); // Handle missing ratings
        case 'popularity':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });
    
    return items;
  }, [searchQuery, selectedCategory, sortBy, menuItems, loading]);
  
  const handleAddToCart = (item) => {
    addToCart(item);
    addToast(`${item.name} added to cart!`, 'cart');
  };
  
  // 6. LOADING & ERROR STATES
  if (loading) {
    return (
      <div className="menu-container">
        <div className="menu-loading" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🍽️</div>
          <h2>Loading delicious dishes...</h2>
          <p style={{ color: '#666' }}>Please wait while we fetch the menu</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="menu-container">
        <div className="menu-error" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#e74c3c' }}>Unable to Load Menu</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <div className="menu-content">
        {/* Header */}
        <div className="menu-header">
          <h1 className="menu-title">Our Delicious Menu</h1>
          <p className="menu-subtitle">
            Explore a wide selection of dishes crafted with the freshest ingredients.
          </p>
        </div>
        
        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        {/* Results Count */}
        <div className="results-count">
          <p className="results-text">
            Showing <span className="results-number">{filteredItems.length}</span> dishes
          </p>
        </div>
        
        {/* Food Grid */}
        {filteredItems.length > 0 ? (
          <div className="food-grid">
            {filteredItems.map((item) => (
              <FoodCard
                // MongoDB uses '_id', not 'id'. This is a CRITICAL fix.
                key={item._id} 
                item={item}
                onQuickView={setSelectedItem}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🍽️</div>
            <h3 className="no-results-title">No dishes found</h3>
            <p className="no-results-text">Try adjusting your search or filter criteria</p>
          </div>
        )}
        
        {/* Quick View Modal */}
        {selectedItem && (
          <QuickViewModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
};

export default Menu;