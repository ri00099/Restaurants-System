// import React, { createContext, useContext, useState } from 'react';

// const CartContext = createContext();

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   const addToCart = (item) => {
//     setCartItems((prevItems) => {
//       // Check if item already exists in cart
//       const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
//       if (existingItemIndex > -1) {
//         // Item exists, increase quantity
//         const updatedItems = [...prevItems];
//         updatedItems[existingItemIndex] = {
//           ...updatedItems[existingItemIndex],
//           quantity: updatedItems[existingItemIndex].quantity + 1,
//         };
//         return updatedItems;
//       } else {
//         // New item, add with quantity 1
//         return [
//           ...prevItems,
//           {
//             ...item,
//             quantity: 1,
//             instructions: '',
//           },
//         ];
//       }
//     });
//   };

//   const removeFromCart = (id) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
//   };

//   const updateQuantity = (id, newQuantity) => {
//     if (newQuantity < 1) return;
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   };

//   const updateInstructions = (id, instructions) => {
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, instructions } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const getCartTotal = () => {
//     return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   };

//   const getCartCount = () => {
//     return cartItems.reduce((sum, item) => sum + item.quantity, 0);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         updateInstructions,
//         clearCart,
//         getCartTotal,
//         getCartCount,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Optional: Load cart from LocalStorage so it survives refresh
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to LocalStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // FIX 1: Use '_id' instead of 'id'
      const existingItemIndex = prevItems.findIndex((i) => i._id === item._id);
      
      if (existingItemIndex > -1) {
        // Item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // New item, add with quantity 1
        return [
          ...prevItems,
          {
            ...item,
            quantity: 1,
            instructions: '',
          },
        ];
      }
    });
  };

  const removeFromCart = (itemId) => {
    // FIX 2: Use '_id' for filtering
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        // FIX 3: Use '_id' for finding the item
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const updateInstructions = (itemId, instructions) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        // FIX 4: Use '_id' here too
        item._id === itemId ? { ...item, instructions } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateInstructions,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};