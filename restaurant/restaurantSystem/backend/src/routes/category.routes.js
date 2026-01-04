const express = require("express");
const router = express.Router();

const { createCategory, deleteCategory, getAllCategories } = require("../controllers/category.controller");


const verifyToken = require("../middleware/auth.middleware");
const verifyAdmin = require("../middleware/admin.middleware");
router.get("/all", getAllCategories);
router.post("/add", verifyToken, verifyAdmin, createCategory);
router.delete("/delete/:id", verifyToken, verifyAdmin, deleteCategory);

module.exports = router;