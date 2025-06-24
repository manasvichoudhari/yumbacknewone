
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    image: String,
    quantity: Number
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    items: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
