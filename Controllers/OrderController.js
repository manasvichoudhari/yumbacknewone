const Order = require('../models/Orders');
const Cart = require('../models/Cart');
exports.createOrder = async (req, res) => {
    let { userId, name, address, phone, paymentMethod, items, totalAmount, paymentStatus } = req.body;

    try {
        //  Auto calculate if totalAmount is missing
        if (!totalAmount || totalAmount === 0) {
            totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        const order = new Order({
            userId,
            name,
            address,
            phone,
            paymentMethod,
            paymentStatus,
            items,
            totalAmount,
        });

        await order.save();

        //  Clear cart after order placed
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};