const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, uploadProfileImage } = require('../Controllers/UserController');
const multer = require('multer');
const router = express.Router();
const { protect } = require('../middleware/auth');



// Image upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

//  Protected Routes
router.get('/profile/:id', protect, getUserProfile);
router.put('/profile/:id', protect, updateUserProfile);
router.post('/upload/:id', protect, upload.single('profileImage'), uploadProfileImage);

module.exports = router;