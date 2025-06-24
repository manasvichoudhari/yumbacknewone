const multer = require('multer');
const path = require('path');

// Storage location and filename setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Yeh folder me file save hogi
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb('Only JPEG, JPG, PNG files are allowed!');
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
