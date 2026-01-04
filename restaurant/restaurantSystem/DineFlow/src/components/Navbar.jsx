import { useState, useEffect, useRef } from "react";
import { Menu, X, User } from "lucide-react";
import { GiShoppingCart } from "react-icons/gi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/Auth.context";
import "../style/Navbar.css";
import logo from "../assets/Graphura logo Black.png";

export default function Navbar({ isAdmin = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const cartCount = getCartCount();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Reservations", path: "/reservation" },
    { name: "Contact", path: "/contact" },
  ];

  if (isAdmin) {
    navItems.splice(
      4,
      0,
      { name: "Kitchen", path: "/kitchen" },
      { name: "Admin", path: "/admin" }
    );
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [location]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-logo">
            <NavLink to="/">
              <img src={logo} alt="logo" />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="navFlex">
            <div className="navbar-menu">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-nav-link" : ""}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="navbar-container-second">
            {/* Cart */}
            <div className="cart-icon-wrapper">
              <NavLink to="/cart" className="nav-link cart-link">
                <GiShoppingCart size={26} />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </NavLink>
            </div>

            {/* Show Login/Signup or Profile based on auth status */}
            {user ? (
              // Profile when logged in - Show Avatar with Name
              <div className="profile-wrapper" ref={profileRef}>
                <button
                  className="profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '50px',
                    padding: '6px 16px 6px 6px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {user.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt="Profile" 
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '16px',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }}>
                      {(user.name || user.email).charAt(0)}
                    </div>
                  )}
                  <span style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#333',
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    Hi, {user.name?.split(' ')[0] || user.email.split('@')[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-item" style={{ 
                      fontWeight: 'bold', 
                      borderBottom: '1px solid #eee', 
                      paddingBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      {user.profilePhoto ? (
                        <img 
                          src={user.profilePhoto} 
                          alt="Profile" 
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '14px',
                          textTransform: 'uppercase'
                        }}>
                          {(user.name || user.email).charAt(0)}
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>
                          {user.name || 'User'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', fontWeight: '400' }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <NavLink to="/profile" className="profile-dropdown-item">
                      My Profile
                    </NavLink>
                    {user?.role !== 'admin' && (
                      <NavLink to="/my-orders" className="profile-dropdown-item">
                        My Orders
                      </NavLink>
                    )}
                    {user?.role === 'admin' && (
                      <NavLink to="/admin" className="profile-dropdown-item">
                        Reservations
                      </NavLink>
                    )}
                    <button 
                      onClick={() => {
                        logout();
                        navigate('/');
                        setProfileOpen(false);
                      }} 
                      className="profile-dropdown-item"
                      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c' }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login/Signup buttons when not logged in
              <div className="auth-buttons" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <NavLink 
                  to="/login" 
                  className="auth-btn-login"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '6px',
                    border: '2px solid #333',
                    background: 'transparent',
                    color: '#333',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="auth-btn-signup"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '6px',
                    background: '#ff6b6b',
                    color: '#fff',
                    fontWeight: '600',
                    textDecoration: 'none',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile Toggle */}
            <div className="mobile-menu-button">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="menu-toggle"
              >
                {isOpen ? <X className="icon" /> : <Menu className="icon" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-items">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? "active-mobile-nav-link" : ""}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}