const connectDB = require('../../config/db');
const Cart = require('../../models/Cart');

module.exports = async (req) => {
    await connectDB();

    if (req.method !== 'DELETE') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    try {
        await Cart.findOneAndDelete({ userId: req.query.userId });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Cart cleared' })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: err.message })
        };
    }
};
