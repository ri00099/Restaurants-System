const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: String,
  table: String,
  time: String,
  items: [{ name: String, qty: Number }],
  status: { type: String, enum: ['pending', 'inProgress', 'ready', 'served'], default: 'pending' }
});

module.exports = mongoose.model('Order', orderSchema);