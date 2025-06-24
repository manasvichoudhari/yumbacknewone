const connectDB = require('../../config/db');
const User = require('../../../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req) => {
    await connectDB();

    if (req.method !== 'POST') {
        return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        const { name, email, password, phone, address, pincode, city } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'User already exists' }) };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword, phone, address, pincode, city });

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                pincode: user.pincode,
                city: user.city,
                profileImage: user.profileImage,
                token: jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1d' })
            })
        };
    } catch (err) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: err.message }) };
    }
};
