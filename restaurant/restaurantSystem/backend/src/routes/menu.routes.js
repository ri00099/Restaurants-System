const express = require("express");
const router = express.Router();
const { getMenu, addMenuItem, deleteMenuItem } = require("../controllers/menu.controller");
const verifyAdmin = require("../middleware/admin.middleware");
const verifyToken = require("../middleware/auth.middleware");

router.get("/all", getMenu); //Anyone can see the menu No login required usually

// router.post("/add", addMenuItem);
router.post("/add", verifyToken, verifyAdmin, addMenuItem);
router.delete("/delete/:id", verifyToken, verifyAdmin, deleteMenuItem);

// router.delete("/delete/:id", deleteMenuItem);

module.exports = router;