// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Kết nối DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Quan trọng cho form data

// Session & Flash
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/member', require('./routes/member'));
app.use('/api/service', require('./routes/service'));
app.use('/api/admin', require('./routes/admin'));
app.use('/', require('./routes/web')); // Đảm bảo route web được load

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));