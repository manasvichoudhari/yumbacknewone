const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/OrderController');

router.post('/', orderController.createOrder);
router.get('/:userId', orderController.getOrdersByUser);

module.exports = router;