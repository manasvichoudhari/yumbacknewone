const express = require('express');
const router = express.Router();
const { submitContact } = require('../Controllers/ContactController');

// POST route for contact form submission
router.post('/', submitContact);

module.exports = router;
