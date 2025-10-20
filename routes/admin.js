const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Service = require('../models/Service');

router.get('/users', authMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/services', authMiddleware(['admin']), async (req, res) => {
  try {
    const services = await Service.find().populate('user member');
    res.json(services);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;