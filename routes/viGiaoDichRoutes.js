const express = require('express');
const ViGiaoDich = require('../models/ViGiaoDich');
const router = express.Router();

router.get('/:walletId', async (req, res) => {
  try {
    const wallet = await ViGiaoDich.findById(req.params.walletId).populate('transactions');
    if (!wallet) return res.status(404).json({ error: 'Ví không tồn tại' });
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;