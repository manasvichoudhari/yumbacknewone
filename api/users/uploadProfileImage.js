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

        // For serverless, assume frontend directly uploads image URL (use S3, Cloudinary, etc.)
        const { profileImage } = req.body;
        user.profileImage = profileImage || user.profileImage;
        await user.save();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Profile image updated successfully', profileImage: user.profileImage })
        };
    } catch (err) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: err.message }) };
    }
};
