const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ab DB se poora user object laega
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

    req.user = user; // isme full user hoga (name, email, role etc.)
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect };
