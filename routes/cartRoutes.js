const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/CartController');

router.get('/:userId', cartController.getCart);
router.post('/', cartController.addToCart);
router.delete('/:userId', cartController.clearCart);

module.exports = router;
