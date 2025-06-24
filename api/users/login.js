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
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1d' })
                })
            };
        } else {
            return { statusCode: 401, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Invalid credentials' }) };
        }
    } catch (err) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: err.message }) };
    }
};
