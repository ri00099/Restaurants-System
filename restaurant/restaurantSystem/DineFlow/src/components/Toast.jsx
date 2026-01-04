import React, { useEffect } from 'react';
import { X, Check, ShoppingCart } from 'lucide-react';
import '../style/Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="toast-icon" />;
      case 'cart':
        return <ShoppingCart className="toast-icon" />;
      default:
        return <Check className="toast-icon" />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <div className="toast-icon-wrapper">
          {getIcon()}
        </div>
        <p className="toast-message">{message}</p>
        <button onClick={onClose} className="toast-close">
          <X size={18} />
        </button>
      </div>
      <div className="toast-progress"></div>
    </div>
  );
};

export default Toast;