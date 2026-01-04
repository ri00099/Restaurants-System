// import React, { useState } from "react";
// import { useAuth } from "../../context/Auth.context";
// import { useNavigate } from "react-router-dom";

// import bgImage from "../../assets/bgImage.png";
// import "../../style/SignUpPage/SignUp.css";

// const SignUp = () => {
//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
//     if (!formData.email.trim()) newErrors.email = "Email is required.";
//     else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter a valid email.";
//     if (!formData.password) newErrors.password = "Password is required.";
//     else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
//     if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
//     else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     signup(formData.email, formData.password);
//     setTimeout(() => {
//       setIsSubmitting(false);
//       navigate("/");
//     }, 500);
//   };

//   return (
//     <div className="signup-page" style={{ backgroundImage: `url(${bgImage})` }}>
//       <div className="signup-overlay" />
//       <div className="signup-container">
//         <div className="signup-card">
//           <h1 className="signup-title">Create an Account</h1>
//           <p className="signup-subtitle">Sign up quickly and start your journey.</p>

//           {errors.general && <div className="signup-error">{errors.general}</div>}

//           <form className="signup-form" onSubmit={handleSubmit} noValidate>
//             <div className="form-group">
//               <label className="form-label">Full Name</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 placeholder="Enter your full name"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 className={`form-input ${errors.fullName ? "input-error" : ""}`}
//               />
//               {errors.fullName && <p className="error-text">{errors.fullName}</p>}
//             </div>

//             <div className="form-group">
//               <label className="form-label">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="you@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`form-input ${errors.email ? "input-error" : ""}`}
//               />
//               {errors.email && <p className="error-text">{errors.email}</p>}
//             </div>

//             <div className="form-group">
//               <label className="form-label">Password</label>
//               <div className="password-wrapper">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Create a strong password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`form-input ${errors.password ? "input-error" : ""}`}
//                 />
//                 <button
//                   type="button"
//                   className="toggle-password-btn"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//               {errors.password && <p className="error-text">{errors.password}</p>}
//             </div>

//             <div className="form-group">
//               <label className="form-label">Confirm Password</label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 placeholder="Re-enter your password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
//               />
//               {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
//             </div>

//             <button type="submit" className="signup-btn" disabled={isSubmitting}>
//               {isSubmitting ? "Creating account..." : "Sign Up"}
//             </button>

//             <p className="signup-footer">
//               Already have an account? <a href="/login">Log in</a>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import bgImage from "../../assets/bgImage.png";
import "../../style/SignUpPage/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  // STATE: Controls which "screen" the user sees (1 = Details, 2 = OTP)
  const [step, setStep] = useState(1); 
  const [isAdminSignup, setIsAdminSignup] = useState(false); // NEW: Admin mode toggle

  // STATE: Stores all the input data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
    adminSecret: "" // NEW: Admin secret field
  });
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Helper to update state when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when typing
  };

  // --- ACTION 1: REQUEST OTP (Step 1) --- OR ADMIN DIRECT SIGNUP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validation
      const newErrors = {};
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      
      // Admin validation
      if (isAdminSignup && !formData.adminSecret) {
        newErrors.adminSecret = "Admin secret key is required";
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // ADMIN SIGNUP: Direct signup without OTP
      if (isAdminSignup) {
        const res = await axios.post("http://localhost:3000/api/auth/admin/signup", {
          email: formData.email,
          password: formData.password,
          name: formData.fullName || "Admin",
          phone: formData.phone,
          adminSecret: formData.adminSecret
        });

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          window.location.href = "/admin";
          return;
        }
      }

      // REGULAR SIGNUP: Request OTP
      const res = await axios.post("http://localhost:3000/api/auth/request-otp", {
        email: formData.email,
        name: formData.fullName || "User",
        phone: formData.phone
      });

      if (res.data.success) {
        setStep(2); // Move to Step 2 (The OTP Box)
      }

    } catch (err) {
      console.error(err);
      // Show the error message from the backend (e.g. "Server Error")
      setErrors({ general: err.response?.data?.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION 2: VERIFY OTP (Step 2) ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.otp) {
        setErrors({ otp: "Please enter the OTP" });
        setLoading(false);
        return;
      }

      // AXIOS CALL: Talks to your backend 'verifyOTP' function
      const res = await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
        name: formData.fullName,
        phone: formData.phone
      });

      if (res.data.success) {
        // 1. Save the Token (Your ID Card)
        localStorage.setItem("token", res.data.token);
        
        // 2. Save User Info (Optional, but useful for displaying name)
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // 3. Reload the page to trigger Auth context to load user from localStorage
        window.location.href = "/";
      }

    } catch (err) {
      console.error(err);
      setErrors({ otp: err.response?.data?.message || "Invalid OTP" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="signup-overlay" />
      <div className="signup-container">
        <div className="signup-card">
          
          {/* DYNAMIC TITLE */}
          <h1 className="signup-title" style={{ color: isAdminSignup ? '#000' : '#fff', textShadow: isAdminSignup ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none' }}>
            {isAdminSignup ? "🔐 Admin Setup" : (step === 1 ? "Create Account" : "Verify OTP")}
          </h1>
          <p className="signup-subtitle">
            {isAdminSignup 
              ? "Create the administrator account (One-time setup)" 
              : (step === 1 
                  ? "Sign up with your email to get started" 
                  : `Enter the code sent to ${formData.email}`)}
          </p>

          {/* ADMIN/USER TOGGLE */}
          {step === 1 && !isAdminSignup && (
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '20px',
              padding: '10px',
              background: 'rgba(0,0,0,0.8)',
              borderRadius: '8px',
              border: '2px solid #000'
            }}>
              <button
                type="button"
                onClick={() => setIsAdminSignup(true)}
                style={{
                  background: '#000',
                  border: '2px solid #fff',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
              >
                🔐 Signup as Admin
              </button>
            </div>
          )}

          {/* GLOBAL ERROR MESSAGE */}
          {errors.general && <div className="signup-error">{errors.general}</div>}

          <form className="signup-form">
            
            {/* --- ADMIN SETUP FORM --- */}
            {isAdminSignup && (
              <>
                <div className="form-group">
                  <label className="form-label">Admin Email</label>
                  <input
                    type="email"
                    name="email"
                    value="admin@restaurant.com"
                    readOnly
                    className="form-input"
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
                    name="fullName"
                    placeholder="Administrator"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value, email: 'admin@restaurant.com' })}
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
                      className={`form-input ${errors.password ? "input-error" : ""}`}
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
                  {errors.password && <p className="error-text">{errors.password}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                  />
                  {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#000', fontWeight: '700' }}>
                    🔑 Admin Secret Key
                  </label>
                  <input
                    type="password"
                    name="adminSecret"
                    placeholder="Enter admin secret key"
                    value={formData.adminSecret}
                    onChange={handleChange}
                    className={`form-input ${errors.adminSecret ? "input-error" : ""}`}
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.1)',
                      border: '2px solid #000',
                      fontWeight: '600'
                    }}
                  />
                  {errors.adminSecret && <p className="error-text">{errors.adminSecret}</p>}
                </div>

                <button 
                  onClick={handleRequestOTP} 
                  className="signup-btn" 
                  disabled={loading}
                  style={{
                    background: '#000',
                    color: '#fff',
                    border: '2px solid #fff',
                    fontWeight: '700',
                    fontSize: '16px',
                    padding: '14px',
                    marginBottom: '15px',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    width: '100%'
                  }}
                >
                  {loading ? "Creating Admin Account..." : "🔐 Create Admin Account"}
                </button>

                <button 
                  type="button"
                  onClick={() => setIsAdminSignup(false)}
                  style={{
                    background: 'transparent',
                    border: '2px solid #ddd',
                    color: '#666',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: '500',
                    marginBottom: '15px'
                  }}
                >
                  ← Back to Regular Signup
                </button>

                <p className="signup-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
                  Already have admin account?{' '}
                  <a href="/login" style={{ color: '#ff6b6b', fontWeight: 'bold', textDecoration: 'underline' }}>
                    Login here
                  </a>
                </p>
              </>
            )}

            {/* --- REGULAR USER FORM (STEP 1) --- */}
            {!isAdminSignup && step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? "input-error" : ""}`}
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
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
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-input ${errors.password ? "input-error" : ""}`}
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
                  {errors.password && <p className="error-text">{errors.password}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                  />
                  {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                </div>

                <button onClick={handleRequestOTP} className="signup-btn" disabled={loading} style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}>
                  {loading ? "Sending..." : "Get OTP"}
                </button>
                <button 
                  type="button"
                  onClick={() => window.history.back()}
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
                  ← Back
                </button>
              </>
            )}

            {/* --- STEP 2 FORM: OTP INPUT (Only for regular users) --- */}
            {!isAdminSignup && step === 2 && (
              <>
                <div className="form-group">
                  <label className="form-label">Enter OTP Code</label>
                  <input
                    type="text"
                    name="otp"
                    placeholder="123456"
                    value={formData.otp}
                    onChange={handleChange}
                    className={`form-input ${errors.otp ? "input-error" : ""}`}
                    maxLength={6}
                    style={{ letterSpacing: "8px", textAlign: "center", fontSize: "1.4rem", fontWeight: "bold" }}
                  />
                  {errors.otp && <p className="error-text">{errors.otp}</p>}
                </div>

                <button onClick={handleVerifyOTP} className="signup-btn" disabled={loading} style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}>
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep(1)}
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
                  ← Go back to change email
                </button>
              </>
            )}

            {/* Login Link */}
            {!isAdminSignup && step === 1 && (
              <p className="signup-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#ff6b6b', fontWeight: 'bold', textDecoration: 'underline' }}>
                  Log in
                </a>
              </p>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;