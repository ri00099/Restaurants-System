// // src/Login.jsx
// import React, { useState } from "react";
// import { useAuth } from "../../context/Auth.context";
// import { useNavigate } from "react-router-dom";
// import bgImage from "../../assets/bgImage.png";
// import "../../style/LoginPage/LoginPage.css";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const res = login(formData.email, formData.password);

//     if (res.success) {
//       navigate(res.role === "admin" ? "/" : "/");
//     }
//   };

//   return (
//     <div
//       className="login-container"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <div className="overlay"></div>

//       <div className="login-card">
//         <h1 className="title">Welcome Back</h1>
//         <p className="subtitle">Sign in to continue</p>

//         <form onSubmit={handleSubmit} className="form">
//           <label className="label">
//             Email
//             <input
//               type="email"
//               name="email"
//               placeholder="you@example.com"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </label>

//           <label className="label">
//             Password
//             <div className="password-box">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />

//               <button
//                 type="button"
//                 className="show-btn"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//             </div>
//           </label>

//           <button type="submit" className="submit-btn">
//             Login
//           </button>

//           <p className="footer-text">
//             Don’t have an account? <a href="/signup">Register</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useAuth } from "../../context/Auth.context";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/bgImage.png";
import "../../style/LoginPage/LoginPage.css";

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
    adminSecret: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminField, setShowAdminField] = useState(false);
  const [error, setError] = useState("");
  
  const { loginWithPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const res = await loginWithPassword(formData.email, formData.password, formData.adminSecret);

    if (res.success) {
      // Check if there's a redirect URL saved
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      } else {
        navigate(res.role === "admin" ? "/admin" : "/");
      }
    } else {
      setError(res.message || "Invalid email or password");
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay"></div>

      <div className="login-card">
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Login to your account</p>

        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#c33', 
            padding: '10px', 
            borderRadius: '6px', 
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="label" style={{ marginTop: '15px' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
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

          {/* Admin Secret Field Toggle */}
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setShowAdminField(!showAdminField)}
              style={{
                background: showAdminField ? '#000' : 'transparent',
                border: showAdminField ? '2px solid #000' : 'none',
                color: showAdminField ? '#fff' : '#000',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                padding: showAdminField ? '8px 20px' : '0',
                borderRadius: '6px',
                textDecoration: showAdminField ? 'none' : 'underline',
                transition: 'all 0.3s ease'
              }}
            >
              {showAdminField ? '✕ Cancel Admin Login' : '🔐 Login as Admin'}
            </button>
          </div>

          {/* Admin Secret Input */}
          {showAdminField && (
            <>
              <label className="label" style={{ marginTop: '15px', color: '#000', fontWeight: '700' }}>Admin Secret Key</label>
              <input
                type="password"
                name="adminSecret"
                placeholder="Enter admin secret key"
                value={formData.adminSecret}
                onChange={handleChange}
                style={{
                  background: 'rgba(0, 0, 0, 0.1)',
                  border: '2px solid #000',
                  fontWeight: '600'
                }}
              />
            </>
          )}

          <button type="submit" className="submit-btn" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '12px',
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '20px',
            marginBottom: '15px'
          }}>
            Login
          </button>

          <p className="footer-text" style={{ marginTop: '20px', textAlign: 'center' }}>
            Don't have an account?{' '}
            <a href="/signup" style={{ color: '#ff6b6b', fontWeight: 'bold', textDecoration: 'underline' }}>
              Sign Up
            </a>
          </p>

          {/* Admin Setup Link */}
          <div style={{ marginTop: '15px', textAlign: 'center', padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
              First time administrator?
            </p>
            <a 
              href="/admin-setup" 
              style={{ 
                color: '#ff6b6b', 
                fontWeight: 'bold', 
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              🔐 Create Admin Account
            </a>
          </div>

          <button 
            type="button"
            onClick={() => window.history.back()}
            style={{
              marginTop: '15px',
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontWeight: '500'
            }}
          >
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;