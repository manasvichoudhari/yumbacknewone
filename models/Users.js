const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    profileImage: { type: String, default: 'default.jpg' },
    phone: String,
    address: String,
    pincode: String,
    city: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
},
{ timestamps: true });

module.exports = mongoose.model('Users', userSchema);