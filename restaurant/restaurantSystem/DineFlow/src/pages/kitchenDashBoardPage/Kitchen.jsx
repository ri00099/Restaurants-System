// import React, { useState } from "react";
// import "../../style/kitchenDashBoard/Kitchen.css";

// const getInitialBoard = () => ({
//   pending: [
//     {
//       id: "DF-001",
//       table: "T-05",
//       time: "2 minutes ago",
//       items: [
//         { name: "Classic Burger", qty: 2 },
//         { name: "French Fries", qty: 1 }
//       ]
//     },

//     {
//       id: "DF-003",
//       table: "T-03",
//       time: "10 minutes ago",
//       items: [
//         { name: "Chicken Salad", qty: 1 },
//         { name: "Iced Tea", qty: 2 }
//       ]
//     }
//   ],

//   inProgress: [
//     {
//       id: "DF-002",
//       table: "T-12",
//       time: "Cooking for 8 mins (7 mins left)",
//       items: [{ name: "Margherita Pizza", qty: 1 }]
//     },

//     {
//       id: "DF-005",
//       table: "T-01",
//       time: "Cooking for 15 mins (5 mins left)",
//       items: [{ name: "Vegetable Lasagna", qty: 1 }]
//     }
//   ],

//   ready: [
//     {
//       id: "DF-004",
//       table: "T-08",
//       time: "Ready for 3 minutes",
//       items: [{ name: "Spaghetti Bolognese", qty: 2 }]
//     },

//     {
//       id: "DF-008",
//       table: "T-04",
//       time: "Ready for 1 minute",
//       items: [{ name: "Grilled Salmon", qty: 1 }]
//     }
//   ],
  
//   served: [
//     {
//       id: "DF-006",
//       table: "T-07",
//       time: "Served 25 minutes ago",
//       items: [
//         { name: "Fish and Chips", qty: 2 },
//         { name: "Lemonade", qty: 2 }
//       ]
//     }
//   ]
// });

// function OrderCard({ status, order, onAction }) {
//   return (
//     <div className={`order-card order-card-${status}`}>
//       <div className="order-card-top">
//         <h3 className="order-id">Order {order.id}</h3>
//         <span className="table-pill">Table {order.table}</span>
//       </div>

//       {onAction && (
//         <button
//           className={`order-action-btn btn-${status}`}
//           onClick={onAction}
//         >
//           {status === "pending" && "Start Cooking"}
//           {status === "inProgress" && "Mark Ready"}
//           {status === "ready" && "Mark Served"}
//         </button>
//       )}
//     </div>
//   );
// }


// export default function KitchenOrderDashboard() {
//   const [board, setBoard] = useState(getInitialBoard);

//   const moveOrder = (from, to, id) => {
//     setBoard(prev => {
//       const fromList = [...prev[from]];
//       const idx = fromList.findIndex(o => o.id === id);
//       if (idx === -1) return prev;

//       const [order] = fromList.splice(idx, 1);
//       const toList = [...prev[to], order];

//       return {
//         ...prev,
//         [from]: fromList,
//         [to]: toList
//       };
//     });
//   };

//   const handleRefresh = () => {
//     setBoard(getInitialBoard());
//   };

//   return (
//     <div className="kitchen-dashboard">
//       {/* Header */}
//       <header className="dashboard-header">
//         <h1 className="dashboard-title">Kitchen Order Dashboard</h1>
//         <button className="refresh-btn" onClick={handleRefresh}>
//           <span className="refresh-icon">↻</span>
//           <span>Refresh</span>
//         </button>
//       </header>

//       {/* Columns */}
//       <main className="board">
//         {/* Pending */}
//         <section className="board-column">
//           <div className="column-header">
//             <span className="column-title">Pending Orders</span>
//             <span className="column-count">{board.pending.length}</span>
//           </div>

//           {board.pending.map(order => (
//             <OrderCard
//               key={order.id}
//               status="pending"
//               order={order}
//               onAction={() => moveOrder("pending", "inProgress", order.id)}
//             />
//           ))}
//         </section>

//         {/* In Progress */}
//         <section className="board-column">
//           <div className="column-header">
//             <span className="column-title">In Progress</span>
//             <span className="column-count">{board.inProgress.length}</span>
//           </div>

//           {board.inProgress.map(order => (
//             <OrderCard
//               key={order.id}
//               status="inProgress"
//               order={order}
//               onAction={() => moveOrder("inProgress", "ready", order.id)}
//             />
//           ))}
//         </section>

//         {/* Ready */}
//         <section className="board-column">
//           <div className="column-header">
//             <span className="column-title">Ready for Pickup</span>
//             <span className="column-count">{board.ready.length}</span>
//           </div>

//           {board.ready.map(order => (
//             <OrderCard
//               key={order.id}
//               status="ready"
//               order={order}
//               onAction={() => moveOrder("ready", "served", order.id)}
//             />
//           ))}
//         </section>

//         {/* Served */}
//         <section className="board-column">
//           <div className="column-header">
//             <span className="column-title">Served</span>
//             <span className="column-count">{board.served.length}</span>
//           </div>

//           {board.served.map(order => (
//             <OrderCard
//               key={order.id}
//               status="served"
//               order={order}
//               onAction={null}
//             />
//           ))}
//         </section>
//       </main>
//  </div>
// );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { RefreshCw, Search, X, Clock, User, Package, Filter, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import "../../style/kitchenDashBoard/Kitchen.css";

// HELPER: Map Backend Status to Frontend Columns
const getColumnFromStatus = (status) => {
  const statusLower = status?.toLowerCase();
  switch (statusLower) {
    case "pending": return "pending";
    case "cooking": 
    case "preparing": return "inProgress";
    case "ready": return "ready";
    case "completed":
    case "delivered": 
    case "served": return "served";
    default: return "pending";
  }
};

// HELPER: Map Frontend Action to Backend Status Name (capitalized to match backend)
const getNextStatus = (currentColumn) => {
  if (currentColumn === "pending") return "Cooking";
  if (currentColumn === "inProgress") return "Ready";
  if (currentColumn === "ready") return "Completed";
  return null;
};

// Calculate time elapsed
const getTimeElapsed = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
};

function OrderCard({ status, order, onAction, onClick }) {
  const items = order.items || [];
  const timeElapsed = getTimeElapsed(order.createdAt);
  
  // Calculate priority based on time (older = higher priority)
  const isPriority = () => {
    const diffMs = new Date() - new Date(order.createdAt);
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins > 15; // Orders older than 15 mins
  };

  return (
    <div 
      className={`order-card order-card-${status} ${isPriority() ? 'priority-order' : ''}`}
      onClick={onClick}
      style={{cursor: 'pointer'}}
    >
      {isPriority() && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: '#ef4444',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '600'
        }}>
          <Bell size={12} style={{marginRight: '4px', display: 'inline'}} />
          URGENT
        </div>
      )}
      
      <div className="order-card-top">
        <h3 className="order-id">{order.orderId}</h3>
        <span className="time-badge">
          <Clock size={14} /> {timeElapsed}
        </span>
      </div>
      
      {/* Customer Info */}
      <div style={{margin: '8px 0', fontSize: '13px', color: '#6b7280'}}>
        <User size={14} style={{display: 'inline', marginRight: '4px'}} />
        {order.userId?.name || "Guest"}
      </div>
      
      {/* Items Count */}
      <div style={{margin: '8px 0', fontSize: '13px', fontWeight: '600', color: '#374151'}}>
        <Package size={14} style={{display: 'inline', marginRight: '4px'}} />
        {items.length} {items.length === 1 ? 'item' : 'items'}
      </div>

      {/* Item Preview (first 2 items) */}
      <div className="order-items-preview">
        {items.slice(0, 2).map((item, index) => (
           <div key={index} style={{ fontSize: "13px", margin: "4px 0", color: '#4b5563' }}>
             • <b>{item.quantity}x</b> {item.name}
           </div>
        ))}
        {items.length > 2 && (
          <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '4px'}}>
            +{items.length - 2} more items
          </div>
        )}
      </div>

      {onAction && (
        <button
          className={`order-action-btn btn-${status}`}
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
        >
          {status === "pending" && " Start Cooking"}
          {status === "inProgress" && " Mark Ready"}
          {status === "ready" && "🍽️ Mark Served"}
        </button>
      )}
    </div>
  );
}

export default function KitchenOrderDashboard() {
  // STATE
  const [board, setBoard] = useState({
    pending: [],
    inProgress: [],
    ready: [],
    served: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, cooking: 0, ready: 0 });
  
  // PAGINATION STATE
  const [pendingPage, setPendingPage] = useState(1);
  const [inProgressPage, setInProgressPage] = useState(1);
  const [readyPage, setReadyPage] = useState(1);
  const [servedPage, setServedPage] = useState(1);
  const itemsPerPage = 6; // Show 6 orders per column

  // FETCH: Get Real Orders from Backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No Access Token found. Please Login as Admin.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:3000/api/orders/all-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const allOrders = response.data.orders;

        // SORT orders into the 4 columns
        const newBoard = { pending: [], inProgress: [], ready: [], served: [] };

        allOrders.forEach((order) => {
          const column = getColumnFromStatus(order.status);
          if (newBoard[column]) {
            newBoard[column].push(order);
          }
        });

        setBoard(newBoard);
        
        // Calculate stats
        setStats({
          total: allOrders.length,
          pending: newBoard.pending.length,
          cooking: newBoard.inProgress.length,
          ready: newBoard.ready.length
        });
        
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Run Fetch on Page Load
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // ACTION: Update Status in Backend
  const handleStatusUpdate = async (currentColumn, orderId) => {
    try {
      const nextStatus = getNextStatus(currentColumn);
      if (!nextStatus) return;

      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3000/api/orders/${orderId}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Filter orders by search query
  const filterOrders = (orders) => {
    if (!searchQuery && !filterPriority) return orders;
    
    return orders.filter(order => {
      const matchesSearch = !searchQuery || 
        order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items?.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (filterPriority) {
        const diffMs = new Date() - new Date(order.createdAt);
        const diffMins = Math.floor(diffMs / 60000);
        return matchesSearch && diffMins > 15;
      }
      
      return matchesSearch;
    });
  };

  // PAGINATION LOGIC
  const paginateOrders = (orders, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return orders.slice(startIndex, endIndex);
  };

  const getTotalPages = (orders) => {
    return Math.ceil(orders.length / itemsPerPage);
  };

  // Get paginated orders for each column
  const filteredPending = filterOrders(board.pending);
  const filteredInProgress = filterOrders(board.inProgress);
  const filteredReady = filterOrders(board.ready);
  const filteredServed = filterOrders(board.served);

  const currentPendingOrders = paginateOrders(filteredPending, pendingPage);
  const currentInProgressOrders = paginateOrders(filteredInProgress, inProgressPage);
  const currentReadyOrders = paginateOrders(filteredReady, readyPage);
  const currentServedOrders = paginateOrders(filteredServed, servedPage);

  const pendingTotalPages = getTotalPages(filteredPending);
  const inProgressTotalPages = getTotalPages(filteredInProgress);
  const readyTotalPages = getTotalPages(filteredReady);
  const servedTotalPages = getTotalPages(filteredServed);

  if (loading && !board.pending.length) return <div className="p-10">Loading Kitchen Dashboard...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="kitchen-dashboard">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">🍳 Kitchen Dashboard</h1>
          <p style={{margin: '5px 0 0', color: '#6b7280', fontSize: '14px'}}>
            Real-time order management system
          </p>
        </div>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <button 
            className="refresh-btn" 
            onClick={fetchOrders}
            style={{display: 'flex', alignItems: 'center', gap: '6px'}}
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        margin: '20px 0',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{fontSize: '14px', opacity: 0.9}}>Total Orders</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', marginTop: '8px'}}>{stats.total}</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{fontSize: '14px', opacity: 0.9}}>Pending</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', marginTop: '8px'}}>{stats.pending}</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{fontSize: '14px', opacity: 0.9}}>Cooking</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', marginTop: '8px'}}>{stats.cooking}</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{fontSize: '14px', opacity: 0.9}}>Ready</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', marginTop: '8px'}}>{stats.ready}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        display: 'flex',
        gap: '10px',
        padding: '0 20px 20px',
        alignItems: 'center'
      }}>
        <div style={{position: 'relative', flex: 1}}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 10px 10px 40px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          {searchQuery && (
            <X 
              size={18} 
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#9ca3af'
              }}
              onClick={() => setSearchQuery('')}
            />
          )}
        </div>
        <button
          onClick={() => setFilterPriority(!filterPriority)}
          style={{
            padding: '10px 20px',
            background: filterPriority ? '#ef4444' : '#f3f4f6',
            color: filterPriority ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          <Bell size={16} />
          {filterPriority ? 'Show All' : 'Priority Only'}
        </button>
      </div>

      <main className="board">
        {/* Pending Column */}
        <section className="board-column">
          <div className="column-header">
            <span className="column-title"> Pending Orders</span>
            <span className="column-count">{filteredPending.length}</span>
          </div>
          {filteredPending.length === 0 ? (
            <div style={{padding: '40px 20px', textAlign: 'center', color: '#9ca3af'}}>
              No pending orders
            </div>
          ) : (
            <>
              {currentPendingOrders.map(order => (
                <OrderCard
                  key={order._id}
                  status="pending"
                  order={order}
                  onAction={() => handleStatusUpdate("pending", order.orderId)}
                  onClick={() => handleViewDetails(order)}
                />
              ))}
              
              {/* Pagination Controls */}
              {pendingTotalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  padding: '10px 0'
                }}>
                  <button
                    onClick={() => setPendingPage(prev => Math.max(prev - 1, 1))}
                    disabled={pendingPage === 1}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: pendingPage === 1 ? '#f9fafb' : 'white',
                      cursor: pendingPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  
                  <span style={{fontSize: '12px', color: '#6b7280', minWidth: '60px', textAlign: 'center'}}>
                    {pendingPage} / {pendingTotalPages}
                  </span>
                  
                  <button
                    onClick={() => setPendingPage(prev => Math.min(prev + 1, pendingTotalPages))}
                    disabled={pendingPage === pendingTotalPages}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: pendingPage === pendingTotalPages ? '#f9fafb' : 'white',
                      cursor: pendingPage === pendingTotalPages ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* In Progress Column */}
        <section className="board-column">
          <div className="column-header">
            <span className="column-title"> Cooking</span>
            <span className="column-count">{filteredInProgress.length}</span>
          </div>
          {filteredInProgress.length === 0 ? (
            <div style={{padding: '40px 20px', textAlign: 'center', color: '#9ca3af'}}>
              No orders cooking
            </div>
          ) : (
            <>
              {currentInProgressOrders.map(order => (
                <OrderCard
                  key={order._id}
                  status="inProgress"
                  order={order}
                  onAction={() => handleStatusUpdate("inProgress", order.orderId)}
                  onClick={() => handleViewDetails(order)}
                />
              ))}
              
              {/* Pagination Controls */}
              {inProgressTotalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  padding: '10px 0'
                }}>
                  <button
                    onClick={() => setInProgressPage(prev => Math.max(prev - 1, 1))}
                    disabled={inProgressPage === 1}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: inProgressPage === 1 ? '#f9fafb' : 'white',
                      cursor: inProgressPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  
                  <span style={{fontSize: '12px', color: '#6b7280', minWidth: '60px', textAlign: 'center'}}>
                    {inProgressPage} / {inProgressTotalPages}
                  </span>
                  
                  <button
                    onClick={() => setInProgressPage(prev => Math.min(prev + 1, inProgressTotalPages))}
                    disabled={inProgressPage === inProgressTotalPages}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: inProgressPage === inProgressTotalPages ? '#f9fafb' : 'white',
                      cursor: inProgressPage === inProgressTotalPages ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Ready Column */}
        <section className="board-column">
          <div className="column-header">
            <span className="column-title"> Ready</span>
            <span className="column-count">{filteredReady.length}</span>
          </div>
          {filteredReady.length === 0 ? (
            <div style={{padding: '40px 20px', textAlign: 'center', color: '#9ca3af'}}>
              No ready orders
            </div>
          ) : (
            <>
              {currentReadyOrders.map(order => (
                <OrderCard
                  key={order._id}
                  status="ready"
                  order={order}
                  onAction={() => handleStatusUpdate("ready", order.orderId)}
                  onClick={() => handleViewDetails(order)}
                />
              ))}
              
              {/* Pagination Controls */}
              {readyTotalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  padding: '10px 0'
                }}>
                  <button
                    onClick={() => setReadyPage(prev => Math.max(prev - 1, 1))}
                    disabled={readyPage === 1}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: readyPage === 1 ? '#f9fafb' : 'white',
                      cursor: readyPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  
                  <span style={{fontSize: '12px', color: '#6b7280', minWidth: '60px', textAlign: 'center'}}>
                    {readyPage} / {readyTotalPages}
                  </span>
                  
                  <button
                    onClick={() => setReadyPage(prev => Math.min(prev + 1, readyTotalPages))}
                    disabled={readyPage === readyTotalPages}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: readyPage === readyTotalPages ? '#f9fafb' : 'white',
                      cursor: readyPage === readyTotalPages ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Served Column */}
        <section className="board-column">
          <div className="column-header">
            <span className="column-title">🍽️ Served</span>
            <span className="column-count">{filteredServed.length}</span>
          </div>
          {filteredServed.length === 0 ? (
            <div style={{padding: '40px 20px', textAlign: 'center', color: '#9ca3af'}}>
              No served orders
            </div>
          ) : (
            <>
              {currentServedOrders.map(order => (
                <OrderCard
                  key={order._id}
                  status="served"
                  order={order}
                  onAction={null}
                  onClick={() => handleViewDetails(order)}
                />
              ))}
              
              {/* Pagination Controls */}
              {servedTotalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  padding: '10px 0'
                }}>
                  <button
                    onClick={() => setServedPage(prev => Math.max(prev - 1, 1))}
                    disabled={servedPage === 1}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: servedPage === 1 ? '#f9fafb' : 'white',
                      cursor: servedPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  
                  <span style={{fontSize: '12px', color: '#6b7280', minWidth: '60px', textAlign: 'center'}}>
                    {servedPage} / {servedTotalPages}
                  </span>
                  
                  <button
                    onClick={() => setServedPage(prev => Math.min(prev + 1, servedTotalPages))}
                    disabled={servedPage === servedTotalPages}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: servedPage === servedTotalPages ? '#f9fafb' : 'white',
                      cursor: servedPage === servedTotalPages ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '600px',
            maxWidth: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '15px'
            }}>
              <div>
                <h2 style={{margin: 0, color: '#111827'}}>Order Details</h2>
                <p style={{margin: '5px 0 0', color: '#6b7280', fontSize: '14px'}}>
                  {selectedOrder.orderId} • {getTimeElapsed(selectedOrder.createdAt)}
                </p>
              </div>
              <X 
                style={{cursor: 'pointer', color: '#9ca3af'}} 
                onClick={() => setShowDetailsModal(false)}
                size={24}
              />
            </div>
            
            {/* Customer Info */}
            <div style={{marginBottom: '20px'}}>
              <h3 style={{fontSize: '16px', color: '#374151', marginBottom: '10px'}}>
                <User size={18} style={{display: 'inline', marginRight: '8px'}} />
                Customer Information
              </h3>
              <div style={{background: '#f9fafb', padding: '15px', borderRadius: '8px'}}>
                <p style={{margin: '5px 0'}}><strong>Name:</strong> {selectedOrder.userId?.name || "Guest"}</p>
                <p style={{margin: '5px 0'}}><strong>Email:</strong> {selectedOrder.userId?.email || "N/A"}</p>
                <p style={{margin: '5px 0'}}><strong>Phone:</strong> {selectedOrder.userId?.phone || "N/A"}</p>
              </div>
            </div>

            {/* Order Items */}
            <div style={{marginBottom: '20px'}}>
              <h3 style={{fontSize: '16px', color: '#374151', marginBottom: '10px'}}>
                <Package size={18} style={{display: 'inline', marginRight: '8px'}} />
                Order Items ({selectedOrder.items.length})
              </h3>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#f9fafb',
                  marginBottom: '8px',
                  borderRadius: '6px'
                }}>
                  <div>
                    <p style={{margin: 0, fontWeight: '500'}}>{item.name}</p>
                    <p style={{margin: '4px 0 0', fontSize: '14px', color: '#6b7280'}}>
                      Quantity: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p style={{margin: 0, fontWeight: '600', color: '#111827'}}>
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{
              padding: '15px',
              background: '#f3f4f6',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '2px solid #d1d5db'}}>
                <span style={{fontWeight: '600', fontSize: '16px'}}>Total Amount:</span>
                <span style={{fontWeight: '700', fontSize: '18px', color: '#22c55e'}}>
                  ₹{selectedOrder.totalAmount}
                </span>
              </div>
            </div>

            {/* Status & Time */}
            <div style={{display: 'flex', gap: '10px'}}>
              <div style={{flex: 1, background: '#eff6ff', padding: '15px', borderRadius: '8px'}}>
                <p style={{margin: '0 0 5px', fontSize: '14px', color: '#6b7280'}}>Status</p>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: 
                    selectedOrder.status === 'completed' ? '#d1fae5' :
                    selectedOrder.status === 'cooking' ? '#fef3c7' :
                    selectedOrder.status === 'pending' ? '#dbeafe' : '#f3f4f6',
                  color:
                    selectedOrder.status === 'completed' ? '#065f46' :
                    selectedOrder.status === 'cooking' ? '#92400e' :
                    selectedOrder.status === 'pending' ? '#1e40af' : '#374151'
                }}>
                  {selectedOrder.status}
                </span>
              </div>
              <div style={{flex: 1, background: '#f0fdf4', padding: '15px', borderRadius: '8px'}}>
                <p style={{margin: '0 0 5px', fontSize: '14px', color: '#6b7280'}}>Ordered</p>
                <p style={{margin: 0, fontWeight: '500'}}>
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}