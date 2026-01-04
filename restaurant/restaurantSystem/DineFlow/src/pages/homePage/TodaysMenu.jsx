import React from 'react';
import '../../style/homePage/TodaysSpecial.css';
import { useCart } from "../../context/CartContext.jsx";
import { Plus, Minus, ShoppingCart } from "lucide-react";

const TodaysMenu = () => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  const specialFood = [
    {
      id: 1001,
      image: 'https://plus.unsplash.com/premium_photo-1664391779617-c81011293ef6?w=900&auto=format&fit=crop&q=60',
      title: 'Crispy Fried Chicken Burger',
      description: 'A crunchy delight with fresh veggies and signature mayo.',
      price: 250
    },
    {
      id: 1002,
      image: 'https://i.pinimg.com/1200x/4a/af/5c/4aaf5cb2f245c0ff2505a36237c0d02a.jpg',
      title: 'Signature Seafood Pasta',
      description: 'Classic Italian pasta with fresh seafood flavors.',
      price: 1250
    },
    {
      id: 1003,
      image: 'https://i.pinimg.com/736x/ab/e6/57/abe65721a6d06545c99230151aab0177.jpg',
      title: 'Gourmet Vegetarian Pizza',
      description: 'Loaded with veggies, cheese, and Italian herbs.',
      price: 1000
    },
    {
      id: 1004,
      image: 'https://i.pinimg.com/1200x/0c/e1/4e/0ce14e1ef631166a411c20a62f32618f.jpg',
      title: 'Chocolate Lava Cake',
      description: 'Molten chocolate with soft sponge sweetness.',
      price: 675
    }
  ];

  const getQuantity = (id) => {
    const item = cartItems.find((i) => (i.id || i._id) === id);
    return item ? item.quantity : 0;
  };

  const handleAdd = (item) => {
    addToCart({
      id: item.id,
      _id: item.id, // Keep both for compatibility
      name: item.title,
      image: item.image,
      price: item.price,
      quantity: 1
    });
  };

  const handleIncrease = (id, qty) => {
    updateQuantity(id, qty + 1);
  };

  const handleDecrease = (id, qty) => {
    if (qty <= 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, qty - 1);
    }
  };

  return (
    <div id="todays-special">
      <section className="specials-section">
        <h2 className="page-title">Today's Irresistible Specials</h2>

        <div className="specials-grid">
          {specialFood.map((item) => {
            const qty = getQuantity(item.id);

            return (
              <div key={item.id} className="special-card">
                <img src={item.image} alt={item.title} />
                
                {qty > 0 && (
                  <div className="special-in-cart-badge">
                    <ShoppingCart size={14} />
                    <span>{qty}</span>
                  </div>
                )}

                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <div className="special-footer">
                  <span>₹{item.price}</span>

                  {qty === 0 ? (
                    <button 
                      className="special-add-btn"
                      onClick={() => handleAdd(item)}
                    >
                      <div className="flexx">
                      <ShoppingCart size={16} color='white' /> 
                      Add to Cart
                      </div>
                    </button>
                  ) : (
                    <div className="special-quantity-box">
                      <button 
                        className="q-btn"
                        onClick={() => handleDecrease(item.id, qty)}
                      >
                        <Minus size={14} />
                      </button>

                      <span className="q-display">{qty}</span>

                      <button 
                        className="q-btn"
                        onClick={() => handleIncrease(item.id, qty)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TodaysMenu;