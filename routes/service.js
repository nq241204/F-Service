const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Service = require('../models/Service');

router.post('/create', authMiddleware(['user']), async (req, res) => {
  const { title, description, price, aiPrice } = req.body;
  try {
    const service = new Service({
      title,
      description,
      user: req.user.id,
      price,
      aiPrice,
    });
    await service.save();
    res.json({ msg: 'Service created', service });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/available', authMiddleware(['member']), async (req, res) => {
  try {
    const services = await Service.find({ status: 'pending' });
    res.json(services);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;