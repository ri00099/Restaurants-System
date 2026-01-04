// import React from 'react'

// const Billing = () => {
//   return (
//     <div>Billing</div>
//   )
// }

// export default Billing

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useCart } from "../../context/CartContext"; // Get Cart Data
// import { useAuth } from "../../context/Auth.context"; // Get User Token
// import "../../style/BillingPage/Billing.css"; // Assuming you will create CSS

// const Billing = () => {
//   const navigate = useNavigate();
//   const { cartItems, getCartTotal, clearCart } = useCart();
//   const { user } = useAuth(); // To check if user is logged in
  
//   const [tableNumber, setTableNumber] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Calculate Taxes
//   const subtotal = getCartTotal();
//   const tax = subtotal * 0.05; // 5% Tax
//   const totalAmount = subtotal + tax;

//   const handlePlaceOrder = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       if (!token) {
//         alert("Please login to place an order.");
//         navigate("/login");
//         return;
//       }

//       if (!tableNumber) {
//         alert("Please enter your Table Number.");
//         setLoading(false);
//         return;
//       }

//       if (cartItems.length === 0) {
//         alert("Your cart is empty!");
//         navigate("/menu");
//         return;
//       }

//       // 1. Prepare Data for Backend
//       // Your backend expects: { items, totalAmount, tableNumber }
//       const orderPayload = {
//         items: cartItems.map(item => ({
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity
//         })),
//         totalAmount: totalAmount,
//         tableNumber: tableNumber
//       };

//       // 2. Call the API
//       // Note: Ensure this route exists in your order.routes.js!
//       const response = await axios.post(
//         "http://localhost:3000/api/orders/create", 
//         orderPayload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         // 3. Success! Clear cart and redirect
//         clearCart();
//         const newOrderId = response.data.order.orderId; // Get ID from backend (e.g. ORD-8392)
//         navigate(`/order-tracking/${newOrderId}`); 
//       }

//     } catch (error) {
//       console.error("Order failed:", error);
//       alert("Failed to place order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="billing-container" style={{ padding: "50px", maxWidth: "600px", margin: "0 auto" }}>
//       <h2>Checkout & Billing</h2>

//       {/* 1. ORDER SUMMARY */}
//       <div className="bill-section" style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
//         <h3>Order Summary</h3>
//         {cartItems.map((item) => (
//           <div key={item._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
//             <span>{item.quantity} x {item.name}</span>
//             <span>₹{item.price * item.quantity}</span>
//           </div>
//         ))}
//         <hr />
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <span>Subtotal:</span>
//             <span>₹{subtotal.toFixed(2)}</span>
//         </div>
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <span>Tax (5%):</span>
//             <span>₹{tax.toFixed(2)}</span>
//         </div>
//         <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginTop: "10px", fontSize: "1.2rem" }}>
//             <span>Total to Pay:</span>
//             <span>₹{totalAmount.toFixed(2)}</span>
//         </div>
//       </div>

//       {/* 2. CUSTOMER DETAILS */}
//       <div className="details-section" style={{ marginBottom: "20px" }}>
//         <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Table Number</label>
//         <input 
//           type="number" 
//           placeholder="e.g. 5"
//           value={tableNumber}
//           onChange={(e) => setTableNumber(e.target.value)}
//           style={{ width: "100%", padding: "10px", fontSize: "1rem" }}
//         />
//       </div>

//       {/* 3. PAYMENT BUTTON */}
//       <button 
//         onClick={handlePlaceOrder}
//         disabled={loading}
//         style={{ 
//             width: "100%", 
//             padding: "15px", 
//             backgroundColor: "#28a745", 
//             color: "white", 
//             border: "none", 
//             fontSize: "1.1rem", 
//             cursor: "pointer",
//             borderRadius: "5px"
//         }}
//       >
//         {loading ? "Processing..." : `Confirm Order (₹${totalAmount.toFixed(2)})`}
//       </button>

//     </div>
//   );
// };

// export default Billing;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/Auth.context";
import "../../style/BillingPage/Billing.css"; 

const Billing = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Calculate Totals
  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; 
  const totalAmount = subtotal + tax;

  // 2. Helper: Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 3. MAIN FUNCTION: Handle Payment & Order
  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    // --- Validation Checks ---
    if (!token) {
      // Save current page to redirect back after login
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }
    if (!tableNumber) {
      setLoading(false);
      return;
    }
    if (cartItems.length === 0) {
      navigate("/menu");
      return;
    }

    setLoading(true);

    try {
      // --- STEP A: Load Script ---
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        console.error("Failed to load payment SDK. Check your internet.");
        setLoading(false);
        return;
      }

      // --- STEP B: Create Order on Backend (Get Razorpay Order ID) ---
      // We send the total amount to your payment controller
      const orderRes = await axios.post(
        "http://localhost:3000/api/payment/create-order",
        { amount: totalAmount }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderRes.data.success) {
        throw new Error("Failed to create payment order");
      }

      const { order } = orderRes.data; // This is the Razorpay Order Object
      
      // --- STEP C: Configure Razorpay Popup ---
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RVMB2tOa62zCpr", // Use env variable
        amount: order.amount,
        currency: "INR",
        name: "DineFlow", // Your App Name
        description: "Food Order Payment",
        order_id: order.id, // The ID we just got from backend
        
        // This runs when payment is SUCCESSFUL
        handler: async function (response) {
          try {
            // --- STEP D: Verify Payment on Backend ---
            const verifyRes = await axios.post(
              "http://localhost:3000/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              // --- STEP E: Payment Verified! Now Create Food Order ---
              await placeFoodOrder(token, response.razorpay_payment_id);
            } else {
              console.error("Payment verification failed!");
            }
          } catch (error) {
            console.error("Verification Error:", error);
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Open the Razorpay Payment Window
      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.description);
        setLoading(false);
      });
      rzp1.open();

    } catch (error) {
      console.error("Payment Start Error:", error);
      alert("Something went wrong initializing payment.");
      setLoading(false);
    }
  };

  // 4. Helper: Finalize Food Order in Database
  const placeFoodOrder = async (token, paymentId) => {
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: totalAmount,
        tableNumber: tableNumber,
        paymentId: paymentId, // We attach the payment ID so Admin knows it's paid
        status: "Paid" // Optional: You can handle this status in backend
      };

      const response = await axios.post(
        "http://localhost:3000/api/orders/final-order",
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        clearCart();
        const newOrderId = response.data.order.orderId;
        // Redirect to Tracking Page
        navigate(`/order-tracking/${newOrderId}`);
      }
    } catch (error) {
      console.error("Food Order Creation Failed:", error);
      alert("Payment successful, but failed to create order. Please contact staff.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="billing-container" style={{ padding: "50px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Checkout & Billing</h2>

      {/* 1. ORDER SUMMARY */}
      <div className="bill-section" style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span>{item.quantity} x {item.name}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tax (5%):</span>
            <span>₹{tax.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginTop: "10px", fontSize: "1.2rem" }}>
            <span>Total to Pay:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* 2. CUSTOMER DETAILS */}
      <div className="details-section" style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Table Number</label>
        <input 
          type="number" 
          placeholder="e.g. 5"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          style={{ width: "100%", padding: "10px", fontSize: "1rem" }}
        />
      </div>

      {/* 3. PAYMENT BUTTON */}
      <button 
        onClick={handlePayment}
        disabled={loading}
        style={{ 
            width: "100%", 
            padding: "15px", 
            backgroundColor: "#3399cc", // Razorpay Blue
            color: "white", 
            border: "none", 
            fontSize: "1.1rem", 
            cursor: "pointer",
            borderRadius: "5px",
            fontWeight: "bold"
        }}
      >
        {loading ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)} with Razorpay`}
      </button>

    </div>
  );
};

export default Billing;