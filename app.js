const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',          // local dev
  'https://yumfront-1.onrender.com' //  deployed frontend
];

app.use(cors({
  origin: (origin, cb) => {
    // Postman / curl jaise non‑browser tools ke liye 'origin' undefined hota hai
    if (!origin || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],   // <-- JWT header ke liye zaroori
  exposedHeaders: ['Authorization']                   // agar client ko header padhni ho
}));
app.options('*', cors());   // pre‑flight sab paths par serve hoga

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const ContactRoutes = require('./routes/ContactRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', ContactRoutes);
app.use('/api/admin', adminRoutes);

//  app.js ke bilkul end mein (module.exports se *pehle*), सिर्फ debug के लिए:
const listEndpoints = require('express-list-endpoints');
console.log('🛣️  Loaded Routes:\n', listEndpoints(app));


module.exports = app;
