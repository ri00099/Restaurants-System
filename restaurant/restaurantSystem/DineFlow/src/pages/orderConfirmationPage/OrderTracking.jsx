// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import '../../style/orderConfirmationPage/OrderTracking.css';

// const OrderTracking = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [currentStatus, setCurrentStatus] = useState(0);
//   const [orderData, setOrderData] = useState(null);
//   const [isCompleted, setIsCompleted] = useState(false);
//   const [showCompletionMessage, setShowCompletionMessage] = useState(false);

//   useEffect(() => {
//     const loadOrderData = async () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const dataParam = urlParams.get('data');
      
//       if (dataParam) {
//         try {
//           const decodedData = JSON.parse(decodeURIComponent(dataParam));
//           setOrderData(decodedData);
//           return;
//         } catch (e) {
//           console.error("Error parsing URL data:", e);
//         }
//       }
      
//       if (location.state?.orderDetails) {
//         setOrderData(location.state.orderDetails);
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);
//         if (response.ok) {
//           const data = await response.json();
//           setOrderData(data.order || data);
//         }
//       } catch (error) {
//         console.error("OrderTracking - Error fetching:", error);
//       }
//     };

//     loadOrderData();
//   }, [location.state, orderId]);

//   useEffect(() => {
//     if (!orderData || isCompleted) return;

//     const statusUpdates = [
//       { delay: 3000, index: 1, backendStatus: 'Preparing' },
//       { delay: 8000, index: 2, backendStatus: 'Cooking' },
//       { delay: 15000, index: 3, backendStatus: 'Completed' }
//     ];

//     const timers = statusUpdates.map(({ delay, index, backendStatus }) =>
//       setTimeout(async () => {
//         setCurrentStatus(index);
        
//         try {
//           const response = await fetch(
//             `http://localhost:3000/api/orders/${orderData.orderId}/status`,
//             {
//               method: 'PATCH',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ status: backendStatus })
//             }
//           );
          
//           if (response.ok && backendStatus === 'Completed') {
//             setTimeout(() => {
//               setIsCompleted(true);
//               setShowCompletionMessage(true);
//             }, 500);
//           }
//         } catch (error) {
//           console.error('Error updating order status:', error);
//         }
//       }, delay)
//     );

//     return () => timers.forEach(timer => clearTimeout(timer));
//   }, [orderData, isCompleted]);

//   const orderStatuses = [
//     { id: 0, title: 'Confirmed', icon: '✓' },
//     { id: 1, title: 'Preparing', icon: '👨‍🍳' },
//     { id: 2, title: 'Cooking', icon: '🔥' },
//     { id: 3, title: 'Ready', icon: '✓' }
//   ];

//   if (!orderData) {
//     return (
//       <div className="order-tracking-page">
//         <div className="tracking-container">
//           <div style={{ textAlign: 'center', padding: '50px' }}>
//             <h2>Loading order details...</h2>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isCompleted && showCompletionMessage) {
//     return (
//       <div className="order-tracking-page completion-page">
//         <div className="confetti-container">
//           {[...Array(25)].map((_, i) => (
//             <div key={i} className="confetti" style={{
//               left: Math.random() * 100 + '%',
//               delay: Math.random() * 0.5 + 's',
//               '--duration': (Math.random() * 1 + 2) + 's'
//             }}></div>
//           ))}
//         </div>
//         <div className="tracking-container completion-container">
//           <div className="completion-content">
//             <div className="completion-icon-wrapper">
//               <div className="completion-checkmark">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <polyline points="20 6 9 17 4 12"></polyline>
//                 </svg>
//               </div>
//             </div>

//             <h1 className="completion-title">Order Confirmed!</h1>
//             <p className="completion-subtitle">Your order has been received and is being prepared</p>
            
//             <div className="table-notification">
//               <p className="table-info">Order will be delivered to</p>
//               <p className="table-number">{orderData.tableNumber || 'Your Table'}</p>
//             </div>

//             <div className="completion-actions">
//               <button 
//                 className="btn-primary" 
//                 onClick={() => navigate('/menu')}
//               >
//                 Continue Ordering
//               </button>
//               <button 
//                 className="btn-secondary" 
//                 onClick={() => navigate('/order')}
//               >
//                 View All Orders
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="order-tracking-page progress-page">
//       <div className="tracking-container">
//         <div className="tracking-header">
//           <button className="back-button" onClick={() => navigate('/menu')}>
//             ← Back to Menu
//           </button>
//           <h1 className="tracking-title">Order Status</h1>
//           <p className="tracking-subtitle">Order #{orderData.orderId}</p>
//         </div>

//         <div className="tracking-content">
//           <div className="status-section">
//             <div className="status-timeline">
//               {orderStatuses.map((status, index) => {
//                 const isActive = index <= currentStatus;
//                 const isCurrent = index === currentStatus;

//                 return (
//                   <div key={status.id} className="status-item">
//                     <div className={`status-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
//                       <span className="step-icon">{status.icon}</span>
//                     </div>
                    
//                     {index !== orderStatuses.length - 1 && (
//                       <div className={`status-line ${isActive ? 'active' : ''}`}></div>
//                     )}

//                     <div className="status-label">
//                       <p className={`step-title ${isActive ? 'active' : ''}`}>{status.title}</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="estimated-card">
//               <div className="estimated-icon">🕐</div>
//               <div>
//                 <p className="estimated-title">Estimated time</p>
//                 <p className="estimated-time">15-20 mins</p>
//               </div>
//             </div>
//           </div>

//           <div className="order-details-section">
//             <div className="details-card">
//               <h2 className="details-title">Order Summary</h2>
              
//               <div className="table-info">🏠 {orderData.tableNumber || 'N/A'}</div>

//               {orderData.instructions && (
//                 <div className="instructions-box">
//                   <h3 className="instructions-title">Special Instructions</h3>
//                   <p className="instructions-text">{orderData.instructions}</p>
//                 </div>
//               )}

//               <div className="items-list">
//                 <p className="items-title">Items ({orderData.itemCount || 0})</p>
//                 {orderData.items && orderData.items.map((item, index) => (
//                   <div key={index} className="item-row">
//                     <div className="item-info">
//                       <span className="item-quantity">{item.quantity}x</span>
//                       <span className="item-name">{item.name}</span>
//                     </div>
//                     <span className="item-price">
//                       ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <div className="order-summary">
//                 <div className="summary-row">
//                   <span className="summary-label">Subtotal</span>
//                   <span className="summary-value">₹{(orderData.subtotal || 0).toFixed(2)}</span>
//                 </div>
//                 <div className="summary-row">
//                   <span className="summary-label">Tax (10%)</span>
//                   <span className="summary-value">₹{(orderData.tax || 0).toFixed(2)}</span>
//                 </div>
//                 <div className="summary-row total">
//                   <span className="summary-label">Total</span>
//                   <span className="summary-value">₹{(orderData.total || 0).toFixed(2)}</span>
//                 </div>
//               </div>

//               {orderData.paymentId && (
//                 <div className="payment-info">
//                   <p className="payment-label">Payment ID</p>
//                   <p className="payment-id">{orderData.paymentId}</p>
//                 </div>
//               )}

//               <button className="btn-new-order" onClick={() => navigate('/menu')}>
//                 Back to Menu
//               </button>
//             </div>

//             <div className="help-card">
//               <h3 className="help-title">Need Help?</h3>
//               <p className="help-text">If you have any questions, please contact our staff.</p>
//               <button className="btn-contact">Contact Staff</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderTracking;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Removed useLocation
import axios from 'axios'; // We use Axios for consistency
import '../../style/orderConfirmationPage/OrderTracking.css';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. HELPER: Convert String Status (DB) to Number (Progress Bar)
  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 0;   // Confirmed
      case 'Preparing': return 1; // Preparing
      case 'Cooking': return 2;   // Cooking
      case 'Ready': return 3;     // Ready
      case 'Completed': return 4; // Served (All ticks green)
      default: return 0;
    }
  };

  const currentStatusIndex = orderData ? getStatusStep(orderData.status) : 0;

  // 2. FETCH DATA (Poll every 5 seconds)
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        // Use the ID from the URL to get the latest status
        const response = await axios.get(`http://localhost:3000/api/orders/${orderId}`, {
           // If you require token for users to track orders, add headers here.
           // For now, assuming tracking is public if you have the ID.
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.data.success) {
          setOrderData(response.data.order);
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      } finally {
        setLoading(false);
      }
    };

    // Initial Load
    fetchOrderStatus();

    // Set up Polling: Check status every 5 seconds
    // This is how Swiggy/Zomato update the screen without refreshing!
    const interval = setInterval(fetchOrderStatus, 5000);

    // Cleanup: Stop checking when user leaves the page
    return () => clearInterval(interval);
  }, [orderId]);


  const orderStatuses = [
    { id: 0, title: 'Confirmed', icon: '✓' },
    { id: 1, title: 'Preparing', icon: '👨‍🍳' },
    { id: 2, title: 'Cooking', icon: '🔥' },
    { id: 3, title: 'Ready', icon: '✓' }
  ];

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="tracking-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Checking kitchen status...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
     return <div className="p-10 text-center">Order not found.</div>;
  }

  // Show Celebration only when status is 'Completed' (Served)
  const isCompleted = orderData.status === 'Completed' || orderData.status === 'Served';

  if (isCompleted) {
    return (
      <div className="order-tracking-page completion-page">
        <div className="confetti-container">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: Math.random() * 100 + '%',
              delay: Math.random() * 0.5 + 's',
              '--duration': (Math.random() * 1 + 2) + 's'
            }}></div>
          ))}
        </div>
        <div className="tracking-container completion-container">
          <div className="completion-content">
            <div className="completion-icon-wrapper">
              <div className="completion-checkmark">✓</div>
            </div>

            <h1 className="completion-title">Enjoy your Meal!</h1>
            <p className="completion-subtitle">Your order has been served.</p>
            
            <div className="completion-actions">
              <button 
                className="btn-primary" 
                onClick={() => navigate('/menu')}
              >
                Order More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-page progress-page">
      <div className="tracking-container">
        <div className="tracking-header">
          <button className="back-button" onClick={() => navigate('/menu')}>
            ← Back to Menu
          </button>
          <h1 className="tracking-title">Order Status</h1>
          <p className="tracking-subtitle">Order #{orderData.orderId}</p>
        </div>

        <div className="tracking-content">
          <div className="status-section">
            <div className="status-timeline">
              {orderStatuses.map((status, index) => {
                // Logic: If current step is 2 (Cooking), then 0, 1, and 2 are active.
                const isActive = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={status.id} className="status-item">
                    <div className={`status-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                      <span className="step-icon">{status.icon}</span>
                    </div>
                    
                    {index !== orderStatuses.length - 1 && (
                      <div className={`status-line ${isActive ? 'active' : ''}`}></div>
                    )}

                    <div className="status-label">
                      <p className={`step-title ${isActive ? 'active' : ''}`}>{status.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="estimated-card">
              <div className="estimated-icon">🕐</div>
              <div>
                <p className="estimated-title">Status: {orderData.status}</p>
                <p className="estimated-time">
                    {orderData.status === 'Pending' ? 'Waiting for confirmation...' : 'Kitchen is working on it!'}
                </p>
              </div>
            </div>
          </div>

          <div className="order-details-section">
            <div className="details-card">
              <h2 className="details-title">Order Summary</h2>
              
              <div className="table-info">🏠 Table {orderData.tableNumber || 'N/A'}</div>

              <div className="items-list">
                {orderData.items && orderData.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-info">
                      <span className="item-quantity">{item.quantity}x</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                    <span className="item-price">
                      ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                 <div className="summary-row total">
                  <span className="summary-label">Total</span>
                  <span className="summary-value">₹{(orderData.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>

              <button className="btn-new-order" onClick={() => navigate('/menu')}>
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;