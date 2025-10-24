const express = require('express');
const DichVu = require('../models/DichVu');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const dichVu = new DichVu(req.body);
    await dichVu.save();
    res.status(201).json({ message: 'Dịch vụ tạo thành công', dichVuId: dichVu._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const dichVus = await DichVu.find();
    res.json(dichVus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;