import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "../../style/adminPage/admin.css";
// Added MessageSquare icon for the Feedback tab
import { Eye, Box, HandCoins, ChartNoAxesCombined, Users, Trash2, Plus, X, Folder, ChevronLeft, ChevronRight, Download, Search, MessageSquare } from "lucide-react"; 
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // --- DASHBOARD DATA ---
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, avgOrder: 0, customers: 0 });
  const [chartData, setChartData] = useState({ ordersByDay: [], revenueByMonth: [] });
  const [allOrders, setAllOrders] = useState([]);
  
  // --- LIST DATA ---
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [feedback, setFeedback] = useState([]); // NEW: State for customer feedback

  // --- PAGINATION & FILTERS ---
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  
  const [menuPage, setMenuPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [reservationsPage, setReservationsPage] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1); // NEW: Pagination state for feedback
  const [itemsPerPage] = useState(10);

  // --- MODAL STATES ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- FORM STATES ---
  const [newItem, setNewItem] = useState({
    name: "", category: "", price: "", description: "", image: ""
  });
  const [newCategoryName, setNewCategoryName] = useState("");

  // =========================================
  // 1. FETCH ALL DATA
  // =========================================
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const analyticsRes = await axios.get("http://localhost:3000/api/analytics/dashboard", config);
        if (analyticsRes.data.success) {
           const s = analyticsRes.data.stats;
           setStats({
             totalOrders: s.totalOrders,
             totalRevenue: s.totalRevenue,
             avgOrder: s.totalOrders > 0 ? Math.round(s.totalRevenue / s.totalOrders) : 0,
             customers: s.totalOrders 
           });
           setChartData(s.charts);
        }
      } catch (e) { console.error("Analytics error", e); }

      try {
        const ordersRes = await axios.get("http://localhost:3000/api/orders/all-orders", config);
        if (ordersRes.data.success) setAllOrders(ordersRes.data.orders);
      } catch (e) { console.error("Orders error", e); }

      const menuRes = await axios.get("http://localhost:3000/api/menu/all");
      if (menuRes.data.success) setMenuItems(menuRes.data.data);

      const catRes = await axios.get("http://localhost:3000/api/category/all");
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
        if (catRes.data.categories.length > 0 && !newItem.category) {
          setNewItem(prev => ({ ...prev, category: catRes.data.categories[0].name }));
        }
      }

      try {
        const usersRes = await axios.get("http://localhost:3000/api/auth/users", config);
        if (usersRes.data.success) setUsers(usersRes.data.users);
      } catch (e) { console.error("Users error", e); }

      try {
        const reservationsRes = await axios.get("http://localhost:3000/api/reservation/all-reservations", config);
        if (reservationsRes.data.success) setReservations(reservationsRes.data.reservations);
      } catch (e) { console.error("Reservations error", e); }

      // NEW: Fetch Feedback Data
      try {
        const feedbackRes = await axios.get("http://localhost:3000/api/contact/admin/feedback", config);
        if (feedbackRes.data.success) {
          setFeedback(feedbackRes.data.feedback || feedbackRes.data.data);
        }
      } catch (e) { console.error("Feedback fetch error", e); }

    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // =========================================
  // 2. MENU HANDLERS
  // =========================================
  const handleDeleteItem = async (id) => {
    if(!window.confirm("Delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/menu/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); 
    } catch (error) { console.error("Failed to delete:", error); }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/api/menu/add", newItem, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        setShowAddModal(false);
        setNewItem({ name: "", category: "Appetizers", price: "", description: "", image: "" });
        fetchData();
      }
    } catch (error) { console.error("Failed to add item:", error); }
  };

  // =========================================
  // 3. CATEGORY HANDLERS
  // =========================================
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/api/category/add", 
        { name: newCategoryName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setShowCategoryModal(false);
        setNewCategoryName("");
        fetchData();
      }
    } catch (error) {
      console.error("Failed to add category:", error.response?.data?.message || error);
      alert(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if(!window.confirm("Delete this category?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/category/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) { console.error("Failed to delete category:", error); }
  };

  // =========================================
  // 4. ORDER STATUS UPDATE
  // =========================================
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  // =========================================
  // 4B. RESERVATION STATUS UPDATE
  // =========================================
  const handleReservationStatusChange = async (reservationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/reservation/update-status/${reservationId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  // =========================================
  // 5. PAGINATION & FILTERING LOGIC
  // =========================================
  const filteredOrders = allOrders
    .filter(order => {
      if (orderStatusFilter !== "all" && order.status?.toLowerCase() !== orderStatusFilter.toLowerCase()) return false;
      
      if (orderSearchQuery) {
        const search = orderSearchQuery.toLowerCase();
        const matchesOrderId = order.orderId?.toLowerCase().includes(search);
        const matchesCustomer = order.userId?.name?.toLowerCase().includes(search);
        if (!matchesOrderId && !matchesCustomer) return false;
      }
      
      return true;
    });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // =========================================
  // 6. EXPORT ORDERS TO CSV
  // =========================================
  const exportOrdersToCSV = () => {
    const headers = ["Order ID", "Customer", "Items", "Total Amount", "Status", "Date"];
    const rows = filteredOrders.map(order => [
      order.orderId,
      order.userId?.name || "Guest",
      order.items.length,
      order.totalAmount,
      order.status,
      new Date(order.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // =========================================
  // 7. UI HELPERS & PAGINATION
  // =========================================
  const filteredMenu = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReservations = reservations.filter(res =>
    res.confirmationCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `table ${res.tableNumber}`.includes(searchQuery.toLowerCase())
  );

  // NEW: Filtered Feedback for search
  const filteredFeedback = feedback.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastMenuItem = menuPage * itemsPerPage;
  const indexOfFirstMenuItem = indexOfLastMenuItem - itemsPerPage;
  const currentMenuItems = filteredMenu.slice(indexOfFirstMenuItem, indexOfLastMenuItem);
  const menuTotalPages = Math.ceil(filteredMenu.length / itemsPerPage);

  const indexOfLastUser = usersPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const usersTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const indexOfLastReservation = reservationsPage * itemsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);
  const reservationsTotalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  // NEW: Feedback Pagination calculations
  const indexOfLastFeedback = feedbackPage * itemsPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - itemsPerPage;
  const currentFeedbackItems = filteredFeedback.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const feedbackTotalPages = Math.ceil(filteredFeedback.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setMenuPage(1);
    setUsersPage(1);
    setReservationsPage(1);
    setFeedbackPage(1); // Reset feedback page on tab change
  }, [activeTab]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p className="header-subtitle">Complete restaurant management and analytics</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard icon={<Box size={20} />} label="Total Orders" value={stats.totalOrders} color="blue" />
        <StatCard icon={<HandCoins size={20} />} label="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="green" />
        <StatCard icon={<ChartNoAxesCombined size={20} />} label="Avg Order" value={`₹${stats.avgOrder.toLocaleString()}`} color="purple" />
        <StatCard icon={<Users size={20} />} label="Customers" value={users.length} color="orange" />
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        
        {/* Management Panel */}
        <div className="management-panel">
          <div className="panel-header">
            <h2 className="panel-title">Management Panel</h2>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <Box size={16} />
              <span>Orders</span>
            </button>
            <button 
              className={`tab-button ${activeTab === "reservations" ? "active" : ""}`}
              onClick={() => setActiveTab("reservations")}
            >
              <ChartNoAxesCombined size={16} />
              <span>Reservations</span>
            </button>
            <button 
              className={`tab-button ${activeTab === "menu" ? "active" : ""}`}
              onClick={() => setActiveTab("menu")}
            >
              <HandCoins size={16} />
              <span>Menu</span>
            </button>
            <button 
              className={`tab-button ${activeTab === "categories" ? "active" : ""}`}
              onClick={() => setActiveTab("categories")}
            >
              <Folder size={16} />
              <span>Categories</span>
            </button>
            <button 
              className={`tab-button ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <Users size={16} />
              <span>Users</span>
            </button>
            {/* NEW: Added Feedback Tab button */}
            <button 
              className={`tab-button ${activeTab === "feedback" ? "active" : ""}`}
              onClick={() => setActiveTab("feedback")}
            >
              <MessageSquare size={16} />
              <span>Feedback</span>
            </button>
          </div>

          {/* Tab Controls */}
          <div className="tab-controls">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={
                  activeTab === "orders" ? "Search by Order ID or Customer..." :
                  activeTab === "reservations" ? "Search by Confirmation Code..." :
                  activeTab === "menu" ? "Search menu items..." :
                  activeTab === "categories" ? "Search categories..." :
                  activeTab === "feedback" ? "Search messages or customers..." : // NEW: Feedback search placeholder
                  "Search users..."
                }
                value={activeTab === "orders" ? orderSearchQuery : searchQuery}
                onChange={(e) => activeTab === "orders" ? setOrderSearchQuery(e.target.value) : setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="action-buttons">
              {activeTab === "orders" ? (
                <>
                  <select 
                    className="filter-select"
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Ready">Ready</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button className="btn-secondary" onClick={exportOrdersToCSV}>
                    <Download size={16} />
                    <span>Export CSV</span>
                  </button>
                </>
              ) : activeTab !== "reservations" && activeTab !== "users" && activeTab !== "feedback" && ( // NEW: Hide "Add" button for feedback
                <button 
                  className="btn-primary"
                  onClick={() => {
                    if (activeTab === "menu") setShowAddModal(true);
                    else if (activeTab === "categories") setShowCategoryModal(true);
                  }}
                >
                  <Plus size={16} />
                  <span>{activeTab === "menu" ? "Add Item" : "Add Category"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <>
                {currentOrders.length === 0 ? (
                  <EmptyState 
                    icon={<Box size={48} />}
                    title="No orders found"
                    message="Orders will appear here once customers start placing them."
                  />
                ) : (
                  <>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOrders.map((order) => (
                            <tr key={order._id}>
                              <td>
                                <span className="order-id">{order.orderId}</span>
                              </td>
                              <td>{order.userId?.name || "Guest"}</td>
                              <td>
                                <span className="item-count">{order.items.length} items</span>
                              </td>
                              <td>
                                <span className="amount">₹{order.totalAmount}</span>
                              </td>
                              <td>
                                <select 
                                  className={`status-select status-${order.status?.toLowerCase()}`}
                                  value={order.status}
                                  onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Cooking">Cooking</option>
                                  <option value="Ready">Ready</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td>
                                <span className="date-text">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="icon-button"
                                  onClick={() => handleViewOrder(order)}
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      indexOfFirst={indexOfFirstOrder}
                      indexOfLast={indexOfLastOrder}
                      totalItems={filteredOrders.length}
                      itemName="orders"
                      onPrevious={prevPage}
                      onNext={nextPage}
                      onPageChange={paginate}
                    />
                  </>
                )}
              </>
            )}

            {/* RESERVATIONS TAB */}
            {activeTab === "reservations" && (
              <>
                {currentReservations.length === 0 ? (
                  <EmptyState 
                    icon={<ChartNoAxesCombined size={48} />}
                    title="No reservations found"
                    message="Reservations will appear here once customers start booking tables."
                  />
                ) : (
                  <>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Confirmation</th>
                            <th>Customer</th>
                            <th>Table</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Guests</th>
                            <th>Status</th>
                            <th>Contact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentReservations.map((reservation) => (
                            <tr key={reservation._id}>
                              <td>
                                <span className="confirmation-code">{reservation.confirmationCode}</span>
                              </td>
                              <td>{reservation.userId?.name || "Guest"}</td>
                              <td>
                                <span className="table-number">Table {reservation.tableNumber}</span>
                              </td>
                              <td>
                                <span className="date-text">
                                  {new Date(reservation.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </span>
                              </td>
                              <td>
                                <span className="time-slot">{reservation.timeSlot}</span>
                              </td>
                              <td>{reservation.guests}</td>
                              <td>
                                <select 
                                  className={`status-select status-${reservation.status?.toLowerCase()}`}
                                  value={reservation.status}
                                  onChange={(e) => handleReservationStatusChange(reservation._id, e.target.value)}
                                >
                                  <option value="Reserved">Reserved</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td>
                                <div className="contact-info">
                                  <div className="contact-phone">{reservation.userId?.phone || 'N/A'}</div>
                                  <div className="contact-email">{reservation.userId?.email || 'N/A'}</div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <Pagination 
                      currentPage={reservationsPage}
                      totalPages={reservationsTotalPages}
                      indexOfFirst={indexOfFirstReservation}
                      indexOfLast={indexOfLastReservation}
                      totalItems={filteredReservations.length}
                      itemName="reservations"
                      onPrevious={() => setReservationsPage(prev => Math.max(prev - 1, 1))}
                      onNext={() => setReservationsPage(prev => Math.min(prev + 1, reservationsTotalPages))}
                      onPageChange={setReservationsPage}
                    />
                  </>
                )}
              </>
            )}

            {/* MENU TAB */}
            {activeTab === "menu" && (
              <>
                {filteredMenu.length === 0 ? (
                  <EmptyState 
                    icon={<HandCoins size={48} />}
                    title="No menu items found"
                    message="Add your first menu item to get started."
                  />
                ) : (
                  <>
                    <div className="items-list">
                      {currentMenuItems.map((item) => (
                        <div className="item-card" key={item._id}>
                          <div className="item-image">
                            <img 
                              src={item.image || "https://via.placeholder.com/80"} 
                              alt={item.name}
                            />
                          </div>
                          <div className="item-details">
                            <h4 className="item-name">{item.name}</h4>
                            <p className="item-meta">
                              <span className="item-price">₹{item.price}</span>
                              <span className="item-separator">•</span>
                              <span className="item-category">{item.category}</span>
                            </p>
                            <p className="item-description">{item.description}</p>
                          </div>
                          <div className="item-actions">
                            <button 
                              className="icon-button danger"
                              onClick={() => handleDeleteItem(item._id)}
                              title="Delete Item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {menuTotalPages > 1 && (
                      <Pagination 
                        currentPage={menuPage}
                        totalPages={menuTotalPages}
                        indexOfFirst={indexOfFirstMenuItem}
                        indexOfLast={indexOfLastMenuItem}
                        totalItems={filteredMenu.length}
                        itemName="items"
                        onPrevious={() => setMenuPage(prev => Math.max(prev - 1, 1))}
                        onNext={() => setMenuPage(prev => Math.min(prev + 1, menuTotalPages))}
                        onPageChange={setMenuPage}
                      />
                    )}
                  </>
                )}
              </>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === "categories" && (
              <>
                {filteredCategories.length === 0 ? (
                  <EmptyState 
                    icon={<Folder size={48} />}
                    title="No categories found"
                    message="Create your first category to organize menu items."
                  />
                ) : (
                  <div className="items-list">
                    {filteredCategories.map((cat) => (
                      <div className="item-card" key={cat._id}>
                        <div className="item-image category-icon">
                          <Folder size={24} />
                        </div>
                        <div className="item-details">
                          <h4 className="item-name">{cat.name}</h4>
                          <p className="item-meta">
                            <span className="item-category">Category ID: {cat._id.slice(-8)}</span>
                          </p>
                        </div>
                        <div className="item-actions">
                          <button 
                            className="icon-button danger"
                            onClick={() => handleDeleteCategory(cat._id)}
                            title="Delete Category"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <>
                {filteredUsers.length === 0 ? (
                  <EmptyState 
                    icon={<Users size={48} />}
                    title="No users found"
                    message="Registered users will appear here."
                  />
                ) : (
                  <>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.map((user) => (
                            <tr key={user._id}>
                              <td>
                                <span className="user-name">{user.name}</span>
                              </td>
                              <td>{user.email}</td>
                              <td>{user.phone || "N/A"}</td>
                              <td>
                                <span className={`role-badge role-${user.role}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td>
                                <span className="date-text">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {usersTotalPages > 1 && (
                      <Pagination 
                        currentPage={usersPage}
                        totalPages={usersTotalPages}
                        indexOfFirst={indexOfFirstUser}
                        indexOfLast={indexOfLastUser}
                        totalItems={filteredUsers.length}
                        itemName="users"
                        onPrevious={() => setUsersPage(prev => Math.max(prev - 1, 1))}
                        onNext={() => setUsersPage(prev => Math.min(prev + 1, usersTotalPages))}
                        onPageChange={setUsersPage}
                      />
                    )}
                  </>
                )}
              </>
            )}

            {/* NEW: FEEDBACK TAB CONTENT */}
            {activeTab === "feedback" && (
              <>
                {currentFeedbackItems.length === 0 ? (
                  <EmptyState 
                    icon={<MessageSquare size={48} />}
                    title="No feedback found"
                    message="Customer messages will appear here once they contact you."
                  />
                ) : (
                  <>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentFeedbackItems.map((item) => (
                            <tr key={item._id}>
                              <td><span className="user-name">{item.name}</span></td>
                              <td>{item.email}</td>
                              <td>
                                <div style={{ maxWidth: '400px', whiteSpace: 'normal', lineHeight: '1.4' }}>
                                  {item.message}
                                </div>
                              </td>
                              <td>
                                <span className="date-text">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {feedbackTotalPages > 1 && (
                      <Pagination 
                        currentPage={feedbackPage}
                        totalPages={feedbackTotalPages}
                        indexOfFirst={indexOfFirstFeedback}
                        indexOfLast={indexOfLastFeedback}
                        totalItems={filteredFeedback.length}
                        itemName="feedback"
                        onPrevious={() => setFeedbackPage(prev => Math.max(prev - 1, 1))}
                        onNext={() => setFeedbackPage(prev => Math.min(prev + 1, feedbackTotalPages))}
                        onPageChange={setFeedbackPage}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Orders Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Orders Trend</h3>
              <span className="chart-period">Last 7 Days</span>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData.ordersByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#d1d5db"
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#d1d5db"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    name="Orders"
                    dot={{ fill: '#6366f1', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue</h3>
              <span className="chart-period">Monthly</span>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#d1d5db"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#d1d5db"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[6, 6, 0, 0]} 
                    fill="#10b981"
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD MENU ITEM */}
      {showAddModal && (
        <Modal
          title="Add New Menu Item"
          onClose={() => setShowAddModal(false)}
        >
          <form onSubmit={handleAddItem} className="modal-form">
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. Margherita Pizza"
                value={newItem.name} 
                onChange={e => setNewItem({...newItem, name: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-select"
                value={newItem.category} 
                onChange={e => setNewItem({...newItem, category: e.target.value})}
              >
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                {categories.length === 0 && (
                  <>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Main Courses">Main Courses</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input 
                type="number"
                className="form-input"
                placeholder="299"
                value={newItem.price} 
                onChange={e => setNewItem({...newItem, price: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-textarea"
                placeholder="Describe your dish..."
                value={newItem.description} 
                onChange={e => setNewItem({...newItem, description: e.target.value})} 
                required
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL (optional)</label>
              <input 
                type="text"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={newItem.image} 
                onChange={e => setNewItem({...newItem, image: e.target.value})} 
              />
              {newItem.image && (
                <div className="image-preview">
                  <img 
                    src={newItem.image} 
                    alt="Preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <p className="preview-error">⚠️ Invalid image URL</p>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Item
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: ADD CATEGORY */}
      {showCategoryModal && (
        <Modal
          title="Add New Category"
          onClose={() => setShowCategoryModal(false)}
        >
          <form onSubmit={handleAddCategory} className="modal-form">
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. Starters"
                value={newCategoryName} 
                onChange={e => setNewCategoryName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowCategoryModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Category
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: ORDER DETAILS */}
      {showOrderDetailsModal && selectedOrder && (
        <Modal
          title="Order Details"
          subtitle={`Order ID: ${selectedOrder.orderId}`}
          onClose={() => setShowOrderDetailsModal(false)}
          size="large"
        >
          <div className="order-details">
            <div className="details-section">
              <h4 className="section-title">Customer Information</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{selectedOrder.userId?.name || "Guest"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{selectedOrder.userId?.email || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{selectedOrder.userId?.phone || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h4 className="section-title">Order Items</h4>
              <div className="order-items-list">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="order-item-info">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="details-section">
              <h4 className="section-title">Order Summary</h4>
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <div className="order-meta">
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span className={`status-badge status-${selectedOrder.status?.toLowerCase()}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Ordered On</span>
                  <span className="meta-value">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ========== REUSABLE COMPONENTS ==========

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, message }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
    </div>
  );
}

function Pagination({ currentPage, totalPages, indexOfFirst, indexOfLast, totalItems, itemName, onPrevious, onNext, onPageChange }) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-number ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {indexOfFirst + 1} to {Math.min(indexOfLast, totalItems)} of {totalItems} {itemName}
      </div>
      <div className="pagination-controls">
        <button 
          className="page-button"
          onClick={onPrevious} 
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>
        
        {renderPageNumbers()}
        
        <button 
          className="page-button"
          onClick={onNext}
          disabled={currentPage === totalPages}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, size = "medium" }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container modal-${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{title}</h2>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}