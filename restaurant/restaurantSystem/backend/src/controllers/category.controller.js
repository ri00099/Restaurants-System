const Category = require("../models/category.model");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({ success: true, message: "Category created", category: newCategory });

  } catch (error) {
    console.error("Error creating category:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted" });

  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    // Fetch everything and sort them by name
    let categories = await Category.find().sort({ name: 1 });
    
    // If no categories exist, create default ones
    if (categories.length === 0) {
      const defaultCategories = [
        "Appetizers",
        "Main Courses", 
        "Desserts",
        "Beverages",
        "Starters",
        "Salads",
        "Soups",
        "Sides"
      ];
      
      console.log("📋 No categories found. Creating default categories...");
      
      for (const catName of defaultCategories) {
        try {
          const newCat = new Category({ name: catName });
          await newCat.save();
        } catch (err) {
          console.log(`Category ${catName} already exists or error:`, err.message);
        }
      }
      
      // Fetch again after creating defaults
      categories = await Category.find().sort({ name: 1 });
      console.log("✅ Default categories created successfully!");
    }
    
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};