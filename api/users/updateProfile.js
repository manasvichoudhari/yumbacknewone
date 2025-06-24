const connectDB = require('../../config/db');
const User = require('../../../models/Users');
const mongoose = require('mongoose');

module.exports = async (req) => {
    await connectDB();

    if (req.method !== 'PUT') {
        return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
            return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Invalid user ID' }) };
        }

        const user = await User.findById(req.query.id);
        if (!user) {
            return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'User not found' }) };
        }

        const { name, phone, address, pincode, city } = req.body;

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.pincode = pincode || user.pincode;
        user.city = city || user.city;

        const updatedUser = await user.save();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                pincode: updatedUser.pincode,
                city: updatedUser.city,
                profileImage: updatedUser.profileImage
            })
        };
    } catch (err) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: err.message }) };
    }
};
