const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");

// POST /api/contact - Submit contact/feedback form
router.post("/", contactController.submitContact);

// POST /api/contact/online-order - Submit online order inquiry
router.post("/online-order", contactController.submitOnlineOrderInquiry);

router.get("/admin/feedback", contactController.getAllFeedback);

module.exports = router;
