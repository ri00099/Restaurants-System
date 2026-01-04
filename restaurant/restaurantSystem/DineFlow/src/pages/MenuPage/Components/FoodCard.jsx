import React, { useState } from "react";
import { useCart } from "../../../context/CartContext.jsx";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import "../../../style/MenuPage/FoodCard.css";
import CategoryBadge from "./CategoryBadge.jsx";

const FoodCard = ({ item, onQuickView, onAddToCart }) => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  
  // Check if item is in cart - Using _id for MongoDB compatibility
  const itemId = item._id || item.id; // Support both MongoDB and local IDs
  const cartItem = cartItems.find((cartItem) => (cartItem._id || cartItem.id) === itemId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleIncrease = (e) => {
    e.stopPropagation();
    if (quantityInCart === 0) {
      // First time adding
      onAddToCart(item);
    } else {
      // Already in cart, just increase
      updateQuantity(itemId, quantityInCart + 1);
    }
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (quantityInCart === 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, quantityInCart - 1);
    }
  };

  return (
    <div className="food-card">
      <div className="food-card-image-container">
        <img 
          src={item.image} 
          alt={item.name} 
          className="food-card-image" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWMwhobRzD-KYHVyo70XCKsSDYfszVx9ZFig&s';
          }}
        />
        <div className="food-card-badge">
          <CategoryBadge category={item.category} />
        </div>
        <div className="food-card-rating">
          <span className="star-icon">★</span>
          <span className="rating-text">{item.rating}</span>
        </div>
        {quantityInCart > 0 && (
          <div className="food-card-in-cart-badge">
            <ShoppingCart size={14} />
            <span>{quantityInCart}</span>
          </div>
        )}
      </div>

      <div className="food-card-content">
        <h3 className="food-card-title">{item.name}</h3>
        <p className="food-card-description">{item.description}</p>

        <div className="food-card-footer">
          <span className="food-card-price">₹{item.price}</span>
          <div className="food-card-time">
          </div>
        </div>

        <div className="food-card-actions">
          {quantityInCart === 0 ? (
            <button 
              onClick={() => onAddToCart(item)} 
              className="btn-add-cart"
            >
              <ShoppingCart size={18} color="white"/>
              Add to Cart
            </button>
          ) : (
            <div className="quantity-controls">
              <button 
                onClick={handleDecrease} 
                className="quantity-btn quantity-btn-decrease"
              >
                <Minus size={16} />
              </button>
              <span className="quantity-display">{quantityInCart}</span>
              <button 
                onClick={handleIncrease} 
                className="quantity-btn quantity-btn-increase"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
          <button onClick={() => onQuickView(item)} className="btn-quick-view">
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;