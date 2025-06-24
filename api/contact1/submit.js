const dbConnect = require('../../config/db');
const Contact = require('../../models/Contact');

module.exports = async (req) => {
    await connectDB();

    if (req.method !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    try {
        const { name, email, message } = req.body;

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Contact message saved successfully' })
        };

    } catch (err) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: err.message })
        };
    }
};
