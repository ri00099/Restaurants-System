const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendEmailOTP } = require("../utils/email.service");

// 0. DIRECT ADMIN SIGNUP (No OTP Required)
exports.adminSignup = async (req, res) => {
  try {
    const { email, password, name, phone, adminSecret } = req.body;

    // Validate admin secret
    const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "RESTAURANT_ADMIN_2025_SECRET";
    if (adminSecret !== ADMIN_SECRET) {
      return res.status(403).json({ 
        success: false, 
        message: "Invalid admin credentials" 
      });
    }

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user && user.password) {
      return res.status(409).json({ 
        success: false, 
        message: "Admin email already exists. Please login instead." 
      });
    }

    // Create or update user directly (no OTP)
    if (!user) {
      user = await User.create({
        email,
        password,
        name: name || "Admin",
        phone: phone || "",
        role: "admin" // Set role to admin directly
      });
    } else {
      user.password = password;
      user.name = name || "Admin";
      if (phone) user.phone = phone;
      user.role = "admin";
      user.otp = null;
      user.otpExpires = null;
      await user.save();
    }

    console.log(`✅ Admin registered successfully: ${email}`);

    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ 
      success: true, 
      message: "Admin account created successfully", 
      token, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });

  } catch (error) {
    console.error("Admin Signup Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 1. REQUEST OTP
exports.requestOTP = async (req, res) => {
  try {
    const { email, name, phone } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    let user = await User.findOne({ email });

    // Check if user already exists with password (completed signup)
    if (user && user.password) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already exists. Please login instead." 
      });
    }

    if (!user) {
      user = await User.create({ email, name, phone, otp, otpExpires });
    } else {
      // User exists but no password (incomplete signup), resend OTP
      user.otp = otp;
      user.otpExpires = otpExpires;
      if (name) user.name = name;
      if (phone) user.phone = phone;
      await user.save();
    }

    const isSent = await sendEmailOTP(email, otp);

    if (isSent) {
      res.json({ success: true, message: `OTP sent to ${email}` });
    } else {
      res.status(500).json({ success: false, message: "Failed to send OTP email" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2. VERIFY OTP (Signup completion with password)
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, password, name, phone } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long" 
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Please request OTP first." });
    }

    // Check if user already completed signup
    if (user.password) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already exists. Please login instead." 
      });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or Expired OTP" });
    }

    // Update user with password and other details
    user.otp = null;
    user.otpExpires = null;
    user.password = password; // Always set password during signup
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();

    console.log(`✅ User registered successfully: ${email} - Password saved: ${!!user.password}`);

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ 
      success: true, 
      message: "Signup Successful", 
      token, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3. PASSWORD-BASED LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, adminSecret } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Check if user has a password set
    if (!user.password) {
      console.log(`Login attempt for ${email} - No password set in database`);
      return res.status(401).json({ 
        success: false, 
        message: "Please complete signup by verifying OTP first" 
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log(`Login attempt for ${email} - Invalid password`);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // ADMIN EMAIL CHECK: Specific admin email gets auto admin role
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@restaurant.com";
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
        console.log(`✅ Admin email detected - User promoted to admin: ${email}`);
      }
    }
    // ADMIN AUTHENTICATION: Check for admin secret key (for other users)
    else if (adminSecret) {
      const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "RESTAURANT_ADMIN_2025_SECRET";
      
      if (adminSecret === ADMIN_SECRET) {
        // Promote user to admin
        if (user.role !== "admin") {
          user.role = "admin";
          await user.save();
          console.log(`✅ User promoted to admin via secret key: ${email}`);
        }
      } else {
        return res.status(403).json({ 
          success: false, 
          message: "Invalid admin credentials" 
        });
      }
    }

    console.log(`✅ Login successful for ${email} as ${user.role}`);

    // Generate token with role
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({ 
      success: true, 
      message: "Login Successful", 
      token, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
};

// 5. GET ALL USERS (ADMIN ONLY)
exports.getAllUsers = async (req, res) => {
  try {
    // verifyToken and verifyAdmin middleware already checked authorization
    const users = await User.find({})
      .select('-password -otp -otpExpires') // Exclude sensitive fields
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      success: true,
      users,
      count: users.length
    });

  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
};

// 6. UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, about, password, profilePhoto } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profilePhoto) user.profilePhoto = profilePhoto;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ 
          success: false, 
          message: "Password must be at least 6 characters long" 
        });
      }
      user.password = password;
    }

    await user.save();

    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};