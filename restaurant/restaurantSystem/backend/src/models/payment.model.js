// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
//   orderId: String,
//   paymentId: String,
//   signature: String,
//   status: {
//     type: String,
//     enum: ["pending", "completed", "failed"],
//     default: "pending"
//   },
//   price: {
//     amount: Number,
//     currency: String
//   },
  
// });

// module.exports = mongoose.model("Payment", paymentSchema);

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true 
  },
  paymentId: { 
    type: String 
  },
  signature: { 
    type: String 
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "INR"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);