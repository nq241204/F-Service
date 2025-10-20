// routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Service = require('../models/Service');

// Dashboard User (nếu muốn tách)
router.get('/dashboard', authMiddleware(['user']), async (req, res) => {
  const services = await Service.find({ user: req.user.id });
  const user = await User.findById(req.user.id);
  res.render('user/dashboard', { user, services });
});

// (Giữ nguyên các route deposit, balance từ trước)
router.post('/deposit', authMiddleware(['user']), async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.balance += amount;
    await user.save();

    const transaction = new Transaction({
      user: req.user.id,
      amount,
      type: 'deposit',
    });
    await transaction.save();

    res.json({ msg: 'Deposit successful', balance: user.balance });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/balance', authMiddleware(['user']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;