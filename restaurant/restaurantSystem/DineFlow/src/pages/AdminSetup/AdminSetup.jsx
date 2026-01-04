import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/bgImage.png";
import "../../style/SignUpPage/SignUp.css";

const AdminSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "admin@restaurant.com",
    password: "",
    confirmPassword: "",
    name: "Administrator",
    phone: "",
    adminSecret: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.password || !formData.adminSecret) {
      setError("Password and Admin Secret are required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/admin/signup", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        adminSecret: formData.adminSecret
      });

      if (res.data.success) {
        // Save token and user data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // Redirect to admin dashboard
        window.location.href = "/admin";
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create admin account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="signup-overlay" />
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="signup-title" style={{ color: '#ff6b6b' }}>
             Admin Setup
          </h1>
          <p className="signup-subtitle">
            Create the administrator account (One-time setup)
          </p>

          {error && (
            <div style={{ 
              background: '#fee', 
              color: '#c33', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '15px',
              fontSize: '14px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                readOnly
                style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                This is the default admin email
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Name</label>
              <input
                type="text"
                name="name"
                placeholder="Administrator"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone (Optional)</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create admin password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingRight: '50px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#ff6b6b' }}>
                 Admin Secret Key
              </label>
              <input
                type="password"
                name="adminSecret"
                placeholder="Enter admin secret key"
                value={formData.adminSecret}
                onChange={handleChange}
                className="form-input"
                style={{ 
                  background: 'rgba(255, 107, 107, 0.1)',
                  border: '2px solid #ff6b6b'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="signup-btn" 
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '15px',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Creating Admin Account..." : " Create Admin Account"}
            </button>

            <button 
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: '2px solid #ddd',
                color: '#666',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: '500'
              }}
            >
              ← Back to Login
            </button>

            <p className="signup-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
              Already have admin account?{' '}
              <a href="/login" style={{ color: '#ff6b6b', fontWeight: 'bold', textDecoration: 'underline' }}>
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
