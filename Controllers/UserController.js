const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const mongoose = require('mongoose')

// =========================user register ===========================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, pincode, city } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            pincode,
            city
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            pincode: user.pincode,
            city: user.city,
            profileImage: user.profileImage,
            token: generateToken(user._id, user.isAdmin)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Token Generator Function
const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, 'secretKey', { expiresIn: '1d' });
};

// =========================userLogin ===============================
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

         if (user && await bcrypt.compare(password, user.password)){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id, user.isAdmin), // ✅ Send token
                isAdmin: user.isAdmin
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

// =======================Get User Profile=============================
const getUserProfile = async (req, res) => {
    try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
} 
         const user = await User.findById(req.params.id);          
        if (user){
        res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                pincode: user.pincode,
                city: user.city,
                profileImage: user.profileImage
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ===========================update User Profile========================
const updateUserProfile = async (req, res) => {
    try 
    {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }


        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, phone, address, pincode, city } = req.body;

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.pincode = pincode || user.pincode;
        user.city = city || user.city;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            pincode: updatedUser.pincode,
            city: updatedUser.city,
            profileImage: updatedUser.profileImage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================================ Upload Profile Image =====================
const uploadProfileImage = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Save the image path with correct slashes
        user.profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            message: 'Profile image uploaded successfully',
            imagePath: user.profileImage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//  Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        res.status(200).json({ message: 'Reset link generated', resetUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Reset Password Controller
const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    forgotPassword, 
    resetPassword, 
    uploadProfileImage 
};