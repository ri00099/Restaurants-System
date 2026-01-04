// import { useLocation } from 'react-router-dom';
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import AppRouter from "./Routes/index.routes";
// import { CartProvider } from "./context/CartContext";
// import { ToastProvider } from "./components/ToastContainer";
// import { AuthProvider, useAuth } from "./context/Auth.context";  // ADD THIS
// import './App.css';

// function AppContent() {
//   const { isAdmin } = useAuth();  // Get admin value from Auth Context
//   const location = useLocation();

//   const hideNavAndFooter =
//     location.pathname === '/signup' || location.pathname === '/login';

//   return (
//     <div className="app">
//       {!hideNavAndFooter && <Navbar isAdmin={isAdmin} />}
//       <AppRouter isAdmin={isAdmin} />
//       {!hideNavAndFooter && <Footer />}
//     </div>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <ToastProvider>
//           <AppContent />
//         </ToastProvider>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;

import React from "react";
import { useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRouter from "./Routes/index.routes";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./components/ToastContainer";
import { AuthProvider, useAuth } from "./context/Auth.context"; // ✅ Correct Import
import { NotificationProvider } from "./contexts/NotificationContext";
import './App.css';

function AppContent() {
  // 1. Get 'isAdmin' directly from your new AuthContext
  const { isAdmin } = useAuth(); 
  const location = useLocation();

  // 2. Logic to hide Navbar on Login/Signup pages
  const hideNavAndFooter =
    location.pathname === '/signup' || 
    location.pathname === '/login';

  return (
    <div className="app">
      {!hideNavAndFooter && <Navbar isAdmin={isAdmin} />}
      
      {/* Pass the admin status to your Router */}
      <AppRouter isAdmin={isAdmin} />
      
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    // 3. Wrap everything in AuthProvider so useAuth() works inside
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;