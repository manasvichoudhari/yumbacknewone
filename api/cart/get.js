const dbConnect = require('../../config/db');
const Cart = require('../../models/Cart');
const mongoose = require('mongoose');

module.exports = async (req) => {
    await dbConnect();

    if (req.method !== 'GET') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    try {
        const cart = await Cart.findOne({ userId: mongoose.Types.ObjectId(req.query.userId) });
        if (!cart) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: [] })
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart.items })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: err.message })
        };
    }
};