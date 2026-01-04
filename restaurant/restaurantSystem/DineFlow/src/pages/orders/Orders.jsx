// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../../style/ordersPage/Orders.css";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/api/orders/all-orders");
//       setOrders(res.data.orders);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   if (loading) return <p className="orders-loading">Loading orders...</p>;

//   return (
//     <div className="orders-container">
//       <h2 className="orders-title">All Orders</h2>

//       {orders.length === 0 && <p className="orders-empty">No orders found.</p>}

//       <div className="orders-list">
//         {orders.map((order) => (
//           <div className="order-card compact" key={order._id}>
//             {/* Header */}
//             <div className="order-header-row">
//               <h3 className="order-id">#{order.orderId}</h3>
//               <span className={`order-status-badge ${order.status.toLowerCase()}`}>
//                 {order.status}
//               </span>
//             </div>

//             {/* Basic details */}
//             <div className="order-basic">
//               <p><strong>Table:</strong> {order.tableNumber}</p>
//               <p><strong>Items:</strong> {order.itemCount}</p>
//               <p className="order-total-amount">₹{order.total}</p>
//             </div>

//             {/* Instructions only if exists */}
//             {order.instructions && order.instructions.trim() !== "" && (
//               <p className="order-note">
//                 <strong>Note:</strong> {order.instructions}
//               </p>
//             )}

//             <p className="order-time">
//               {new Date(order.createdAt).toLocaleString()}
//             </p>

//             {/* Items */}
//             <div className="order-items">
//               <ul>
//                 {order.items.map((item, idx) => (
//                   <li key={idx}>
//                     {item.name} — <b>×{item.qty}</b> <span>₹{item.price}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Orders;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/Auth.context";
import { useNavigate } from "react-router-dom";
import "../../style/ordersPage/Orders.css";

const MyReservations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setReservations([]);
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:3000/api/reservation/my-reservations", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setReservations(res.data.reservations);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Reserved': return '#3b82f6';
      case 'Confirmed': return '#10b981';
      case 'Completed': return '#6366f1';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Reserved': return '#dbeafe';
      case 'Confirmed': return '#d1fae5';
      case 'Completed': return '#e0e7ff';
      case 'Cancelled': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <p className="orders-loading">Loading your reservations...</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 className="orders-title">🎯 My Reservations</h2>
        {user && (
          <p style={{ color: '#666', fontSize: '14px' }}>Welcome back, {user.name || user.email}!</p>
        )}
      </div>

      {reservations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📅</div>
          <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '10px' }}>
            No Reservations Found
          </h3>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            You haven't made any table reservations yet.
          </p>
          <button 
            onClick={() => navigate('/reservation')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              padding: '12px 30px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Book a Table Now
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {reservations.map((reservation) => (
            <div className="order-card" key={reservation._id} style={{
              border: `2px solid ${getStatusBg(reservation.status)}`,
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700',
                    color: '#8b5cf6',
                    margin: '0 0 5px 0'
                  }}>
                    {reservation.confirmationCode}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    margin: '0'
                  }}>
                    Table {reservation.tableNumber}
                  </p>
                </div>
                <span style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: getStatusBg(reservation.status),
                  color: getStatusColor(reservation.status)
                }}>
                  {reservation.status}
                </span>
              </div>

              {/* Reservation Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#9ca3af',
                    margin: '0 0 5px 0',
                    fontWeight: '600'
                  }}>📅 DATE</p>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#374151',
                    margin: '0',
                    fontWeight: '600'
                  }}>
                    {new Date(reservation.date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                <div>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#9ca3af',
                    margin: '0 0 5px 0',
                    fontWeight: '600'
                  }}>⏰ TIME</p>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#374151',
                    margin: '0',
                    fontWeight: '600'
                  }}>
                    {reservation.timeSlot}
                  </p>
                </div>

                <div>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#9ca3af',
                    margin: '0 0 5px 0',
                    fontWeight: '600'
                  }}>👥 GUESTS</p>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#374151',
                    margin: '0',
                    fontWeight: '600'
                  }}>
                    {reservation.guests} {reservation.guests > 1 ? 'people' : 'person'}
                  </p>
                </div>
              </div>

              {/* Special Details */}
              {(reservation.occasion && reservation.occasion !== 'None') && (
                <div style={{
                  background: '#fef3c7',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#92400e',
                    margin: '0 0 5px 0',
                    fontWeight: '600'
                  }}>🎉 OCCASION</p>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#92400e',
                    margin: '0'
                  }}>
                    {reservation.occasion}
                  </p>
                </div>
              )}

              {(reservation.seatingPreference && reservation.seatingPreference !== 'No Preference') && (
                <div style={{
                  background: '#e0f2fe',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#075985',
                    margin: '0 0 5px 0',
                    fontWeight: '600'
                  }}>💺 SEATING</p>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#075985',
                    margin: '0'
                  }}>
                    {reservation.seatingPreference}
                  </p>
                </div>
              )}

              {reservation.specialRequest && (
                <div style={{
                  background: '#f3f4f6',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    margin: '0 0 5px 0',
                    fontWeight: '600'
                  }}>📝 SPECIAL REQUEST</p>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#374151',
                    margin: '0',
                    lineHeight: '1.5'
                  }}>
                    {reservation.specialRequest}
                  </p>
                </div>
              )}

              {/* Footer */}
              <p style={{ 
                fontSize: '12px', 
                color: '#9ca3af',
                margin: '15px 0 0 0',
                paddingTop: '15px',
                borderTop: '1px solid #e5e7eb'
              }}>
                Booked on {new Date(reservation.createdAt).toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;