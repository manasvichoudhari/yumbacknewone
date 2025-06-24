const connectDB = require('../../config/db');
const User = require('../../../models/Users');
const crypto = require('crypto');

module.exports = async (req) => {
    await connectDB();

    if (req.method !== 'POST') {
        return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'User not found' }) };
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Reset link generated', resetUrl })
        };
    } catch (err) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: err.message }) };
    }
};
