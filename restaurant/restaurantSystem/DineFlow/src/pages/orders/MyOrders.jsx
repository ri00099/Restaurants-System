import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/Auth.context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Orders.css';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f39c12',
      'Cooking': '#3498db',
      'Ready': '#2ecc71',
      'Delivered': '#27ae60',
      'Cancelled': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">🛍️ My Orders</h1>
        <p className="orders-subtitle">Track all your delicious orders here</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🍽️</div>
          <h2 style={{ color: '#555', marginBottom: '10px' }}>No Orders Yet</h2>
          <p style={{ color: '#777', marginBottom: '30px' }}>
            Looks like you haven't placed any orders. Start exploring our menu!
          </p>
          <button 
            onClick={() => navigate('/menu')}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3 className="order-id">Order #{order.orderId}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status-badge" style={{ 
                  background: getStatusColor(order.status),
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {order.status}
                </div>
              </div>

              <div className="order-items">
                <h4 style={{ marginBottom: '12px', color: '#333' }}>Items Ordered:</h4>
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <div className="order-item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                    <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-details">
                  <div className="order-detail-item">
                    <span className="detail-label">Table:</span>
                    <span className="detail-value">#{order.tableNumber || 'N/A'}</span>
                  </div>
                  <div className="order-detail-item">
                    <span className="detail-label">Total Items:</span>
                    <span className="detail-value">{calculateTotalItems(order.items)}</span>
                  </div>
                </div>
                <div className="order-total">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-amount">₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
