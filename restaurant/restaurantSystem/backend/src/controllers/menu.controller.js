const Menu = require("../models/menu.model");
const mongoose = require("mongoose");
const fallbackMenuData = require("../utils/fallbackMenu");

// This runs when the frontend loads the Menu Page
exports.getMenu = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log("⚠️  Database not connected. Using fallback menu data.");
      return res.json({ 
        success: true, 
        count: fallbackMenuData.length, 
        data: fallbackMenuData,
        warning: "Using demo data. Please connect MongoDB for full functionality."
      });
    }

    const items = await Menu.find();
    
    // If database is empty, return fallback data
    if (items.length === 0) {
      console.log("⚠️  Database is empty. Using fallback menu data.");
      return res.json({ 
        success: true, 
        count: fallbackMenuData.length, 
        data: fallbackMenuData,
        warning: "Using demo data. Run 'node seedMenu.js' to populate database."
      });
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("Error fetching menu:", error);
    // Return fallback data even on error
    res.json({ 
      success: true, 
      count: fallbackMenuData.length, 
      data: fallbackMenuData,
      warning: "Error connecting to database. Using demo data."
    });
  }
};

// 2. Add New Item (For Admin)
exports.addMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "Name, Price and Category are required" });
    }

    const newItem = await Menu.create({
      name,
      category,
      price,
      description,
      image
    });

    res.status(201).json({ success: true, message: "Item added to menu", item: newItem });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params; // We need the ID to know which one to delete

    const item = await Menu.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Item deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};