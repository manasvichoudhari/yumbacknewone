const connectDB = require('../../config/db');
const User = require('../../../models/Users');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = async (req) => {
    await connectDB();

    if (req.method !== 'PUT') {
        return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.query.token).digest('hex');
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

        if (!user) {
            return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Invalid or expired token' }) };
        }

        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Password reset successfully' })
        };
    } catch (err) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: err.message }) };
    }
};

