const express = require("express");
const router = express.Router();
const { requestOTP, verifyOTP, login, adminSignup, getAllUsers, updateProfile } = require("../controllers/auth.controller");
const { otpValidation } = require("../middleware/validators");
const validateRequest = require("../middleware/validate.middleware");
const verifyToken = require("../middleware/auth.middleware");
const verifyAdmin = require("../middleware/admin.middleware");

// Admin direct signup (no OTP required)
router.post("/admin/signup", adminSignup);

// Regular user routes
router.post("/request-otp", requestOTP);
router.post("/verify-otp", otpValidation, validateRequest, verifyOTP);
router.post("/login", login);

// Profile update route (requires authentication)
router.put("/update-profile", verifyToken, updateProfile);

// Admin-only route to get all users
router.get("/users", verifyToken, verifyAdmin, getAllUsers);

module.exports = router;