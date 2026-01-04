import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../context/Auth.context";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfilePage.css";

export default function ProfilePage() {
  const fileInputRef = useRef(null);
  const { user, logout, updateProfile } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    about: "",
    password: "",
    repeatPassword: "",
  });

  const [avatarUrl, setAvatarUrl] = useState(
    user?.profilePhoto || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || user?.email || "User") + "&background=667eea&color=fff&size=200"
  );

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const cartCount = getCartCount();

  // Update avatar when user data loads
  useEffect(() => {
    if (user?.profilePhoto) {
      setAvatarUrl(user.profilePhoto);
    } else if (user) {
      setAvatarUrl("https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || user.email || "User") + "&background=667eea&color=fff&size=200");
    }
  }, [user]);

  // Load user orders count
  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const res = await axios.get("http://localhost:3000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setOrderCount(res.data.orders.length);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    
    fetchOrderCount();
  }, []);

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email.";
    if (form.password && form.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    if (form.password !== form.repeatPassword)
      e.repeatPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((p) => ({ ...p, [e.target.name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const updateData = {
        name: form.fullName,
        phone: form.phone,
        about: form.about,
        profilePhoto: avatarUrl // Include the profile photo
      };

      // Add password if user wants to change it
      if (form.password) {
        updateData.password = form.password;
      }

      const res = await axios.put(
        "http://localhost:3000/api/auth/update-profile",
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Update context and local storage with new profile photo
        updateProfile(res.data.user);
        
        setForm((p) => ({ ...p, password: "", repeatPassword: "" }));
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- AVATAR UPLOAD ----------------
  const chooseFile = () => fileInputRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      console.error("Image must be < 5MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      setAvatarUrl(base64Image);
      
      // Immediately save to backend
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.put(
          "http://localhost:3000/api/auth/update-profile",
          { profilePhoto: base64Image },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          updateProfile(res.data.user);
        }
      } catch (error) {
        console.error("Error updating profile photo:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-shell">
      <div className="profile-card">

        {/* ---------- SIDEBAR ---------- */}
        <aside className="profile-side">
          <div className="pro-avatar-wrap">
            <img src={avatarUrl} alt="" className="pro-avatar" />
            <button onClick={chooseFile} className="pro-upload">Change</button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFile}
            />
          </div>

          <div className="pro-side-info">
            <p className="pro-name">{form.fullName}</p>
            <p className="pro-email">{form.email}</p>
          </div>

          <div className="pro-nav">
            {user?.role === 'admin' && (
              <button 
                className="pro-nav-item"
                onClick={() => navigate('/admin')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span> Reservations</span>
              </button>
            )}
            {user?.role !== 'admin' && (
              <>
                <button 
                  className="pro-nav-item"
                  onClick={() => navigate('/my-orders')}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span> My Orders</span>
                </button>
                <button 
                  className="pro-nav-item"
                  onClick={() => navigate('/order')}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span> My Reservations</span>
                </button>
              </>
            )}
            <button 
              className="pro-nav-item"
              onClick={() => navigate('/cart')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>🛒 My Cart</span>
              {cartCount > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>{cartCount}</span>
              )}
            </button>
            <button 
              className="pro-nav-item"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{ color: '#e74c3c', marginTop: '10px' }}
            >
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* ---------- MAIN FORM ---------- */}
        <main className="profile-main">
          <form onSubmit={handleSubmit} className="pro-form">
            <h2 className="pro-title">Profile Details</h2>

            {/* Full name */}
            <label className="pro-label">Full name *</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={`pro-input ${errors.fullName ? "error" : ""}`}
            />
            {errors.fullName && <p className="pro-err">{errors.fullName}</p>}

            {/* Email */}
            <label className="pro-label">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`pro-input ${errors.email ? "error" : ""}`}
            />
            {errors.email && <p className="pro-err">{errors.email}</p>}

            {/* Phone */}
            <label className="pro-label">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="pro-input"
            />

            {/* About */}
            <label className="pro-label">About</label>
            <textarea
              name="about"
              rows={3}
              value={form.about}
              onChange={handleChange}
              className="pro-textarea"
            />

            <hr className="pro-divider" />

            <p className="pro-small">Change password (optional)</p>

            {/* Password */}
            <label className="pro-label">New password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`pro-input ${errors.password ? "error" : ""}`}
            />
            {errors.password && <p className="pro-err">{errors.password}</p>}

            {/* Repeat */}
            <label className="pro-label">Repeat password</label>
            <input
              type="password"
              name="repeatPassword"
              value={form.repeatPassword}
              onChange={handleChange}
              className={`pro-input ${errors.repeatPassword ? "error" : ""}`}
            />
            {errors.repeatPassword && (
              <p className="pro-err">{errors.repeatPassword}</p>
            )}

            <div className="pro-actions">
              <button className="pro-btn" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}