import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import Notification from '../components/Notification/Notification';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [lastCheckedOrders, setLastCheckedOrders] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const checkOrderUpdates = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const orders = response.data.orders;

        orders.forEach(order => {
          const lastStatus = lastCheckedOrders[order.orderId];
          const currentStatus = order.status;

          // Check if status changed to Cooking, Ready, or Completed
          if (lastStatus && lastStatus !== currentStatus) {
            if (['Cooking', 'Preparing', 'Ready', 'Completed'].includes(currentStatus)) {
              addNotification({
                orderId: order.orderId,
                status: currentStatus,
                message: `Order status updated to ${currentStatus}`
              });
            }
          }

          // Update last checked status
          setLastCheckedOrders(prev => ({
            ...prev,
            [order.orderId]: currentStatus
          }));
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
      }
      console.error('Error checking order updates:', error);
    }
  }, [isLoggedIn, lastCheckedOrders]);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Initial check
    checkOrderUpdates();

    // Poll every 10 seconds for order updates
    const interval = setInterval(() => {
      checkOrderUpdates();
    }, 10000);

    return () => clearInterval(interval);
  }, [isLoggedIn, checkOrderUpdates]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
