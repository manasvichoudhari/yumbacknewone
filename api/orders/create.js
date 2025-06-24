const connectDB = require('../../config/db');
const Order = require('../../models/Orders');
const Cart = require('../../models/Cart');

module.exports = async (req) => {
    await connectDB();

    if (req.method !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    let { userId, name, address, phone, paymentMethod, items, totalAmount, paymentStatus } = req.body;

    try {
        if (!totalAmount || totalAmount === 0) {
            totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        const order = new Order({
            userId,
            name,
            address,
            phone,
            paymentMethod,
            paymentStatus,
            items,
            totalAmount,
        });

        await order.save();

        await Cart.findOneAndDelete({ userId });

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Order placed successfully', order })
        };

    } catch (err) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: err.message })
        };
    }
};
