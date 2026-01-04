const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, // You will store the URL of the image here
    default: "https://via.placeholder.com/150" 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);