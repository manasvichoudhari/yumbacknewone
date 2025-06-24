const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  address: String,
  phone: String,
  paymentMethod: String,
  paymentStatus: { type: String, default: 'Pending' },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      image: String,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
