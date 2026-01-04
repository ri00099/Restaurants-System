const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("⚠️ DB connection failed:", error.message);
    console.log("⚠️ Server will run without database. Please start MongoDB to enable all features.");
    // Don't exit - let the server run without DB for testing
    // process.exit(1);
  }
};

module.exports = connectDB;