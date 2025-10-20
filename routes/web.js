// routes/web.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const Service = require('../models/Service');

// Trang chủ
router.get('/', (req, res) => {
  res.render('home');
});

// Đăng ký
router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error', 'Email đã tồn tại');
      return res.redirect('/register');
    }
    user = new User({ email, password: await bcrypt.hash(password, 10), role });
    await user.save();
    req.flash('success', 'Đăng ký thành công! Vui lòng đăng nhập.');
    res.redirect('/login');
  } catch (err) {
    req.flash('error', 'Lỗi server');
    res.redirect('/register');
  }
});

// Đăng nhập
router.get('/login', (req, res) => res.render('login'));
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      req.flash('error', 'Sai email hoặc mật khẩu');
      return res.redirect('/login');
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    req.session.user = { id: user._id, email: user.email, role: user.role };
    req.session.token = token; // Lưu token vào session
    res.redirect(`/dashboard/${user.role}`);
  } catch (err) {
    req.flash('error', 'Lỗi server');
    res.redirect('/login');
  }
});

// Đăng xuất
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
// Route cho ví tiền
router.get('/user/wallet', authMiddleware(['user']), async (req, res) => {
  const user = await User.findById(req.session.user.id);
  res.render('user/wallet', { user, qrCode: null });
});

router.post('/user/wallet/deposit', authMiddleware(['user']), async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.session.user.id);
  if (!amount || amount <= 0) {
    req.flash('error', 'Số tiền không hợp lệ');
    return res.redirect('/user/wallet');
  }
  user.balance += parseInt(amount);
  await user.save();

  const transaction = new Transaction({
    user: user._id,
    amount,
    type: 'deposit',
  });
  await transaction.save();

  req.flash('success', 'Nạp tiền thành công!');
  res.redirect('/user/wallet');
});

const QRCode = require('qrcode');

router.get('/user/wallet', authMiddleware(['user']), async (req, res) => {
  const user = await User.findById(req.session.user.id);
  res.render('user/wallet', { user, qrCode: null, success_msg: req.flash('success'), error_msg: req.flash('error') });
});

router.post('/user/wallet/deposit', authMiddleware(['user']), async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.session.user.id);
  if (!amount || amount <= 0 || amount < 10000) {
    req.flash('error', 'Số tiền nạp phải lớn hơn 10,000 VNĐ');
    return res.redirect('/user/wallet');
  }
  const qrText = `Nạp ${amount.toLocaleString()} VNĐ cho ${user.email} - Hạn chót: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`;
  const qrCode = await QRCode.toDataURL(qrText);
  user.balance += parseInt(amount);
  await user.save();
  const transaction = new Transaction({ user: user._id, amount, type: 'deposit' });
  await transaction.save();
  req.flash('success', `Nạp ${amount.toLocaleString()} VNĐ thành công!`);
  res.render('user/wallet', { user, qrCode, success_msg: req.flash('success'), error_msg: req.flash('error') });
});

// Dashboard cho từng vai trò
router.get('/dashboard/:role', authMiddleware(['user', 'member', 'admin']), async (req, res) => {
  const { role } = req.params;
  const user = await User.findById(req.session.user.id);
  if (role === 'user') {
    const services = await Service.find({ user: user._id });
    res.render('user/dashboard', { user, services });
  } else if (role === 'member') {
    res.render('member/dashboard', { user });
  } else if (role === 'admin') {
    res.render('admin/dashboard', { user });
  } else {
    req.flash('error', 'Vai trò không hợp lệ');
    res.redirect('/login');
  }
});
module.exports = router;