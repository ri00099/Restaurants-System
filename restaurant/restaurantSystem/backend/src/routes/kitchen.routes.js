const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchen.controller');

router.get('/orders', kitchenController.getOrders);
router.put('/orders/:id', kitchenController.updateOrderStatus);

module.exports = router;