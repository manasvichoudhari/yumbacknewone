const mongoose = require('mongoose');
const Cart = require('../models/Cart');

//========================= GET items===========================
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: mongoose.Types.ObjectId(req.params.userId) });
        if (!cart) return res.json({ items: [] });
         res.json({ items: cart.items });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ================ADD TO CART===============================

exports.addToCart = async (req, res) => {
    console.log('Request Body:', req.body);
    const { userId, item } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        let cart = await Cart.findOne({userId });
        if (!cart) {
            cart = new Cart({ userId, items: [item] });
        } else {
            const index = cart.items.findIndex(i => i.id === item.id);
            if (index > -1) {
                cart.items[index].quantity += 1;
            } else {
                cart.items.push(item);
            }
        }

        await cart.save();
        res.json({ items: cart.items });

    } catch (err) {
        console.error('Error in addToCart:', err.message);
        res.status(500).json({ message: err.message });
    }
};


// ===================CLEAR CART================================
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId:req.params.userId });
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};