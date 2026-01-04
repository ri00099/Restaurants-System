// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     orderId: { type: String, required: true },
//     tableNumber: String,
//     items: [{
//       name: String,
//       quantity: Number,
//       price: Number,
//       image: String,
//       instructions: String
//     }],
//     instructions: String,
//     subtotal: Number,
//     tax: Number,
//     total: Number,
//     itemCount: Number,
//     paymentId: String,
//     paymentOrderId: String,
//     status: { 
//       type: String, 
//       enum: ['Pending', 'Preparing', 'Cooking', 'Ready', 'Completed', 'Cancelled'],
//       default: 'Pending'
//     },
//     timestamp: Date
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // Added unique for safety
    
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", // Links to the User table
      required: true 
    },

    tableNumber: { type: String, required: true }, 
    
    items: [{
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: String,
      instructions: String
    }],
    
    totalAmount: { type: Number, required: true }, 
    status: { 
      type: String, 
      // The allowed steps for the kitchen
      enum: ['Pending', 'Preparing', 'Cooking', 'Ready', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);