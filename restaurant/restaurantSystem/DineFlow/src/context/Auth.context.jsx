// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       const parsed = JSON.parse(savedUser);
//       setUser(parsed);
//       setIsAdmin(parsed.role === "admin");
//     }
//   }, []);


//   const login = (email, password) => {

//     if (email === "admin@graphura.com" && password === "admin123") {
//       const adminUser = { email, role: "admin" };
//       setUser(adminUser);
//       setIsAdmin(true);
//       localStorage.setItem("user", JSON.stringify(adminUser));
//       return { success: true, role: "admin" };
//     }

//     const normalUser = { email, role: "user" };
//     setUser(normalUser);
//     setIsAdmin(false);
//     localStorage.setItem("user", JSON.stringify(normalUser));
//     return { success: true, role: "user" };
//   };

//   // Signup function
//   const signup = (email, password) => {
//     const normalUser = { email, role: "user" };
//     setUser(normalUser);
//     setIsAdmin(false);
//     localStorage.setItem("user", JSON.stringify(normalUser));
//     return { success: true };
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAdmin(false);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAdmin, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
// Import the new OTP functions
import { requestOtp, verifyOtp } from "../services/api"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  // 1. Load User on Startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === "admin"); 
      } catch (e) {
        console.error("Error parsing user data", e);
        logout();
      }
    }
  }, []);

  // 2. Step 1: Request OTP
  const sendOtpToEmail = async (email, name, phone) => {
    try {
      const response = await requestOtp({ email, name, phone });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("OTP Request Error:", error);
      return { success: false, message: error.response?.data?.message || "Failed to send OTP" };
    }
  };

  // 3. Step 2: Verify OTP (The REAL Login)
  const verifyUserOtp = async (email, otp) => {
    try {
      const response = await verifyOtp({ email, otp });
      
      const { token, user: userData } = response.data;

      // Save Data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update State
      setUser(userData);
      setIsAdmin(userData.role === "admin");

      // Force reload of user state
      window.dispatchEvent(new Event('storage'));

      return { success: true, role: userData.role };

    } catch (error) {
      console.error("OTP Verify Error:", error);
      return { success: false, message: error.response?.data?.message || "Invalid OTP" };
    }
  };

  // 4. Login with Email & Password (Traditional Login)
  const loginWithPassword = async (email, password, adminSecret = null) => {
    try {
      const payload = {
        email,
        password
      };

      // Add admin secret if provided
      if (adminSecret) {
        payload.adminSecret = adminSecret;
      }

      const response = await axios.post("http://localhost:3000/api/auth/login", payload);

      if (response.data.success) {
        const { token, user: userData } = response.data;

        // Save Data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Update State
        setUser(userData);
        setIsAdmin(userData.role === "admin");

        // Force reload of user state
        window.dispatchEvent(new Event('storage'));

        return { success: true, role: userData.role };
      }

      return { success: false, message: "Login failed" };

    } catch (error) {
      console.error("Login Error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Invalid email or password" 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    setIsAdmin(updatedUser.role === "admin");
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, sendOtpToEmail, verifyUserOtp, loginWithPassword, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);