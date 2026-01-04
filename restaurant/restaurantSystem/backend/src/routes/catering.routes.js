const express = require("express");
const router = express.Router();
const cateringController = require("../controllers/catering.controller");

// POST /api/catering - Submit catering request
router.post("/", cateringController.submitCateringRequest);

module.exports = router;
