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
import { useNavigate, Link } from "react-router-dom";
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

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const res = await loginWithPassword(formData.email, formData.password, formData.adminSecret);

    if (res.success) {
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
    <div className="auth-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="auth-overlay"></div>

      <div className="auth-container">
        <div className="auth-glass-card">
          <header className="auth-header">
            <h1 className="title">Welcome Back</h1>
            <p className="subtitle">Login to your account</p>
          </header>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-box">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-box">
              <label className="label">Password</label>
              <div className="pass-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>

            {/* Admin Toggle Section */}
            <div className="admin-toggle-wrapper">
              <button
                type="button"
                className={`toggle-btn ${showAdminField ? 'active' : ''}`}
                onClick={() => setShowAdminField(!showAdminField)}
              >
                {showAdminField ? '✕ Cancel Admin Login' : '🔐 Login as Admin'}
              </button>
            </div>

            {showAdminField && (
              <div className="input-box admin-highlight">
                <label className="label">Admin Secret Key</label>
                <input
                  type="password"
                  name="adminSecret"
                  placeholder="Enter secret key"
                  value={formData.adminSecret}
                  onChange={handleChange}
                />
              </div>
            )}

            <button type="submit" className="auth-btn">
              Login
            </button>

            <footer className="auth-footer">
              <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
              
              <div className="admin-setup-link">
                <p>First time administrator?</p>
                <Link to="/admin-setup">🔐 Create Admin Account</Link>
              </div>

              <button 
                type="button"
                className="back-btn"
                onClick={() => navigate(-1)}
              >
                ← Back to Home
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;