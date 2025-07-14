const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/OrderController');
const { protect } = require('../middleware/auth');

//  Only logged-in user can place order
router.post('/', protect, orderController.createOrder);

//  User can see their own orders
router.get('/:userId', protect, orderController.getOrdersByUser);

module.exports = router;
