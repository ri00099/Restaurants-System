import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 
import bgImage from "../../assets/bgImage.png";
import "../../style/SignUpPage/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [isAdminSignup, setIsAdminSignup] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "", otp: "", adminSecret: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isAdminSignup) {
        const res = await axios.post("/api/auth/admin/signup", { ...formData, name: formData.fullName || "Admin" });
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          window.location.href = "/admin";
          return;
        }
      }
      const res = await axios.post("/api/auth/request-otp", { email: formData.email, name: formData.fullName || "User", phone: formData.phone });
      if (res.data.success) setStep(2);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Error occurred" });
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", { ...formData });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";
      }
    } catch (err) {
      setErrors({ otp: err.response?.data?.message || "Invalid OTP" });
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="auth-overlay" />
      
      <div className="auth-container">
        <div className="auth-glass-card">
          <header className="auth-header">
            <h1>{isAdminSignup ? "Admin Setup" : (step === 1 ? "Create Account" : "Verify OTP")}</h1>
            <p>{step === 1 ? "Sign up to your account" : `Code sent to ${formData.email}`}</p>
          </header>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            {step === 1 ? (
              <div className="form-grid">
                <div className="input-box full">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="you@example.com" value={isAdminSignup ? "admin@restaurant.com" : formData.email} readOnly={isAdminSignup} onChange={handleChange} />
                </div>

                <div className="input-split">
                  <div className="input-box">
                    <label>Full Name</label>
                    <input type="text" name="fullName" placeholder="John Doe" onChange={handleChange} />
                  </div>
                  <div className="input-box">
                    <label>Phone</label>
                    <input type="text" name="phone" placeholder="+91..." onChange={handleChange} />
                  </div>
                </div>

                <div className="input-box full">
                  <label>Password</label>
                  <div className="pass-field">
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" onChange={handleChange} />
                    <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? "HIDE" : "SHOW"}</span>
                  </div>
                </div>

                <div className="input-box full">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} />
                </div>

                {isAdminSignup && (
                  <div className="input-box full admin-highlight">
                    <label>🔑 Secret Key</label>
                    <input type="password" name="adminSecret" placeholder="Enter Secret" onChange={handleChange} />
                  </div>
                )}
              </div>
            ) : (
              <div className="otp-area">
                <label>Verification Code</label>
                <input type="text" maxLength={6} placeholder="000000" onChange={handleChange} name="otp" />
              </div>
            )}

            <button className="auth-btn" onClick={step === 1 ? handleRequestOTP : handleVerifyOTP} disabled={loading}>
              {loading ? "Please wait..." : "Continue"}
            </button>
          </form>

          <footer className="auth-footer">
            <button className="toggle-btn" onClick={() => {setIsAdminSignup(!isAdminSignup); setStep(1)}}>
              {isAdminSignup ? "User Signup" : "🔐 Admin Signup"}
            </button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignUp;