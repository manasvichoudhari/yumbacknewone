const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, uploadProfileImage } = require('../Controllers/UserController');
const multer = require('multer');
const router = express.Router();



// Image upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/upload/:id', upload.single('profileImage'), uploadProfileImage);

module.exports = router;