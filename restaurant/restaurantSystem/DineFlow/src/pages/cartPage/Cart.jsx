import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/Auth.context";
import { useNavigate } from "react-router-dom";
import "../../style/cartPage/Cart.css";
import { MdDeleteOutline } from "react-icons/md";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    updateInstructions,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [tableNumber, setTableNumber] = useState("1");
  const [overallInstructions, setOverallInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  /* ===========================
      LOAD RAZORPAY SCRIPT
     =========================== */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      setRazorpayReady(true);
      console.log("✅ Razorpay loaded");
    };

    script.onerror = () => {
      alert("Failed to load payment system. Please refresh.");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /* ===========================
      PRICE CALCULATIONS
     =========================== */
  const subtotal = Number(getCartTotal() || 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const totalAmount = Number((subtotal + tax).toFixed(2));

  /* ===========================
      PAYMENT FLOW (MAIN)
     =========================== */
  const initiatePayment = async () => {
    const token = localStorage.getItem("token");

    // 🔐 1. Razorpay ready check
    if (!razorpayReady) {
      alert("Payment system is loading, please wait...");
      return;
    }

    // 🔐 2. Auth check
    if (!token) {
      alert("Please login to place an order.");
      navigate("/signup");
      return;
    }

    // 🛒 3. Cart validation
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // 💰 4. Amount validation
    if (totalAmount <= 0) {
      alert("Invalid order amount");
      return;
    }

    // ⛔ 5. Prevent double click
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      /* ===========================
          CREATE PAYMENT ORDER
         =========================== */
      const orderRes = await axios.post(
        "http://localhost:3000/api/payment/create-order",
        { amount: totalAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!orderRes.data?.success) {
        throw new Error("Order creation failed");
      }

      const { order } = orderRes.data;

      /* ===========================
          RAZORPAY CONFIG
         =========================== */
      const options = {
        key:
          import.meta.env.VITE_RAZORPAY_KEY_ID ||
          "rzp_test_RmxPQX943pqyY6",
        amount: order.amount,
        currency: "INR",
        name: "DineFlow",
        description: "Restaurant Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            /* ===========================
                VERIFY PAYMENT
               =========================== */
            const verifyRes = await axios.post(
              "http://localhost:3000/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (!verifyRes.data.success) {
              throw new Error("Payment verification failed");
            }

            // 💾 Save order in DB
            await saveFinalOrder(token, response.razorpay_payment_id);
          } catch (err) {
            console.error(err);
            alert("Payment successful but verification failed.");
          } finally {
            setIsProcessing(false);
          }
        },

        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: user?.phone || "",
        },

        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        alert(response.error.description || "Payment failed");
        setIsProcessing(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Something went wrong");
      setIsProcessing(false);
    }
  };

  /* ===========================
      SAVE FINAL ORDER
     =========================== */
  const saveFinalOrder = async (token, paymentId) => {
    const payload = {
      items: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        instructions: item.instructions || "",
      })),
      totalAmount,
      tableNumber,
      paymentId,
      status: "Paid",
      instructions: overallInstructions,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/orders/final-order",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        clearCart();
        setOverallInstructions("");
        navigate(`/order-tracking/${res.data.order.orderId}`);
      }
    } catch (err) {
      console.error(err);
      alert("Order saved failed after payment");
    }
  };

  /* ===========================
      UI
     =========================== */
  return (
    <div className="order-page">
      <div className="order-container">
        <h1 className="order-title">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <a href="/menu" className="browse-menu-btn">
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="order-content">
            <div className="order-items-section">
              {cartItems.map((item) => (
                <OrderItem
                  key={item._id}
                  item={item}
                  updateQuantity={updateQuantity}
                  updateInstructions={updateInstructions}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>

            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              total={totalAmount}
              tableNumber={tableNumber}
              setTableNumber={setTableNumber}
              instructions={overallInstructions}
              setInstructions={setOverallInstructions}
              onPay={initiatePayment}
              isProcessing={isProcessing}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* ===========================
    CHILD COMPONENTS
   =========================== */

const OrderItem = ({
  item,
  updateQuantity,
  updateInstructions,
  removeFromCart,
}) => (
  <div className="order-item-card">
    <img src={item.image} alt={item.name} className="order-item-image" />

    <div className="order-item-details">
      <h3>{item.name}</h3>
      <p>{item.description}</p>

      <div className="order-item-controls">
        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
          −
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
          +
        </button>

        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
      </div>

      <textarea
        placeholder="Special instructions"
        value={item.instructions || ""}
        onChange={(e) =>
          updateInstructions(item._id, e.target.value)
        }
      />
    </div>

    <button onClick={() => removeFromCart(item._id)}>
      <MdDeleteOutline size={24} />
    </button>
  </div>
);

const OrderSummary = ({
  subtotal,
  tax,
  total,
  tableNumber,
  setTableNumber,
  instructions,
  setInstructions,
  onPay,
  isProcessing,
}) => (
  <div className="order-summary-card">
    <h2>Order Summary</h2>

    <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
    <p>Tax: ₹{tax.toFixed(2)}</p>
    <p className="total">Total: ₹{total.toFixed(2)}</p>

    <select value={tableNumber} onChange={(e) => setTableNumber(e.target.value)}>
      {[1, 2, 3, 4, 5, 6].map((t) => (
        <option key={t} value={t}>
          Table {t}
        </option>
      ))}
    </select>

    <textarea
      placeholder="Overall instructions"
      value={instructions}
      onChange={(e) => setInstructions(e.target.value)}
    />

    <button onClick={onPay} disabled={isProcessing}>
      {isProcessing ? "Processing..." : "Pay Now"}
    </button>
  </div>
);

export default Cart;