const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/analytics.controller");
const verifyToken = require("../middleware/auth.middleware");
const verifyAdmin = require("../middleware/admin.middleware");

// Only the Admin should see how much money the business makes!
router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);

module.exports = router;