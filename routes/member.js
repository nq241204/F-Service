const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Member = require('../models/Member');

router.get('/profile', authMiddleware(['member']), async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user.id });
    res.json(member);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;