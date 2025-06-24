const connectDB = require('../../config/db');
const Order = require('../../models/Orders');

module.exports = async (req) => {
    await connectDB();

    if (req.method !== 'GET') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    try {
        const orders = await Order.find({ userId: req.query.userId }).sort({ createdAt: -1 });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orders)
        };

    } catch (err) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: err.message })
        };
    }
};
