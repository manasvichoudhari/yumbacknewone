const connectDB = require('../../config/db');
const User = require('../../../models/Users');
const mongoose = require('mongoose');

module.exports = async (req) => {
    await connectDB();

    if (req.method !== 'GET') {
        return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
            return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Invalid user ID' }) };
        }

        const user = await User.findById(req.query.id);
        if (user) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    pincode: user.pincode,
                    city: user.city,
                    profileImage: user.profileImage
                })
            };
        } else {
            return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'User not found' }) };
        }
    } catch (err) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: err.message }) };
    }
};
