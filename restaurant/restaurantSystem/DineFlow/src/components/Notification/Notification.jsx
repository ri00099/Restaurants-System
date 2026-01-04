import React, { useEffect } from 'react';
import { X, CheckCircle, Clock, ChefHat, Package } from 'lucide-react';
import './Notification.css';

const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const getIcon = () => {
    switch (notification.status) {
      case 'Cooking':
      case 'Preparing':
        return <ChefHat size={24} className="notification-icon cooking" />;
      case 'Ready':
        return <Package size={24} className="notification-icon ready" />;
      case 'Completed':
        return <CheckCircle size={24} className="notification-icon completed" />;
      default:
        return <Clock size={24} className="notification-icon pending" />;
    }
  };

  const getMessage = () => {
    switch (notification.status) {
      case 'Cooking':
        return `Your order ${notification.orderId} is being prepared! 🍳`;
      case 'Preparing':
        return `Your order ${notification.orderId} preparation has started! 👨‍🍳`;
      case 'Ready':
        return `Your order ${notification.orderId} is ready for pickup! 🎉`;
      case 'Completed':
        return `Your order ${notification.orderId} has been completed! ✅`;
      default:
        return `Order ${notification.orderId} status updated to ${notification.status}`;
    }
  };

  return (
    <div className={`notification-toast ${notification.status.toLowerCase()}`}>
      <div className="notification-content">
        {getIcon()}
        <div className="notification-message">
          <h4>{getMessage()}</h4>
          <p className="notification-time">Just now</p>
        </div>
      </div>
      <button className="notification-close" onClick={() => onClose(notification.id)}>
        <X size={18} />
      </button>
    </div>
  );
};

export default Notification;
