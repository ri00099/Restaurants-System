const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader) {
    return res.status(401).json({ success: false, message: "Access Denied: Login Required" });
  }

  try {
    // Header format: "Bearer <token>"
    const token = tokenHeader.split(" ")[1];
    if (!token) throw new Error("No token");

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = verifyToken;