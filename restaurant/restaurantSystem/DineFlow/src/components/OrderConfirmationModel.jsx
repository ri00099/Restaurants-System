import React, { useEffect, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../style/orderConfirmationPage/OrderConfirmation.css'

const OrderConfirmationModal = ({ orderDetails, onClose }) => {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate checkmark after 300ms
    const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 300);
    
    // Show content after 800ms
    const contentTimer = setTimeout(() => setShowContent(true), 800);

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const handleTrackOrder = () => {
    navigate(`/order-tracking/${orderDetails.orderId}`);
    onClose();
  };

  return (
    <div className="confirmation-overlay" onClick={onClose}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        {/* Success Animation */}
        <div className="success-animation">
          <div className={`success-circle ${showCheckmark ? 'show' : ''}`}>
            <div className="success-checkmark">
              <Check size={60} strokeWidth={3} />
            </div>
          </div>
          <div className="success-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
            <div className="particle particle-6"></div>
          </div>
        </div>

        {/* Order Details */}
        <div className={`confirmation-content ${showContent ? 'show' : ''}`}>
          <h2 className="confirmation-title">Order Confirmed! 🎉</h2>
          <p className="confirmation-subtitle">
            Your delicious meal is being prepared
          </p>

          <div className="order-info-card">
            <div className="order-info-row">
              <span className="order-info-label">Order ID</span>
              <span className="order-info-value">#{orderDetails.orderId}</span>
            </div>
            <div className="order-info-row">
              <span className="order-info-label">Table Number</span>
              <span className="order-info-value">{orderDetails.tableNumber}</span>
            </div>
            <div className="order-info-row">
              <span className="order-info-label">Total Amount</span>
              <span className="order-info-value total-amount">
                ${orderDetails.total.toFixed(2)}
              </span>
            </div>
            <div className="order-info-row">
              <span className="order-info-label">Items</span>
              <span className="order-info-value">{orderDetails.itemCount} items</span>
            </div>
          </div>

          <div className="estimated-time">
            <div className="time-icon">⏱️</div>
            <div className="time-text">
              <span className="time-label">Estimated Time</span>
              <span className="time-value">20-25 minutes</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <button className="btn-track-order" onClick={handleTrackOrder}>
              Track Your Order
              <ArrowRight size={20} />
            </button>
            <button className="btn-close-modal" onClick={onClose}>
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;