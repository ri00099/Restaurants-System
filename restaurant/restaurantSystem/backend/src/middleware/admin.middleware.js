const User = require("../models/user.model");

const verifyAdmin = async (req, res, next) => {
  try {
   // (req.user comes from verifyToken)
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: "Access Denied: Not Logged In" });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access Denied: Admins Only" });
    }

    next();
    
  } catch (error) {
    console.error("Admin Check Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = verifyAdmin;