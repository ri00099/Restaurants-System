const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   name: { type: String, default: "User" },
//   phone: { type: String }, 
//   otp: { type: String },   // Stores the OTP code
//   otpExpires: { type: Date } // Expiration time
// }, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String }, // Password field for traditional login
  otp: { type: String },
  otpExpires: { type: Date },
  profilePhoto: { type: String }, // Store base64 image or URL
  
  role: { 
    type: String, 
    enum: ["customer", "admin"], // Only these two words allowed
    default: "customer"          
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);