const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  tableNumber: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: String, 
    required: true // Format: "YYYY-MM-DD"
  },
  timeSlot: { 
    type: String, 
    required: true // Format: "HH:MM"
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  specialRequest: {
    type: String,
    default: ""
  },
  occasion: {
    type: String,
    enum: ["None", "Birthday", "Anniversary", "Business Meeting", "Proposal", "Other"],
    default: "None"
  },
  seatingPreference: {
    type: String,
    enum: ["No Preference", "Window", "Corner", "Outdoor", "Private"],
    default: "No Preference"
  },
  preOrderItems: [{
    name: String,
    quantity: Number
  }],
  status: { 
    type: String, 
    enum: ["Booked", "Reserved", "Confirmed", "Cancelled", "Completed"], 
    default: "Reserved"
  },
  confirmationCode: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Rule: A table cannot be Booked AND Reserved at the same time
reservationSchema.index({ tableNumber: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model("Reservation", reservationSchema);