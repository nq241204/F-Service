const express = require('express');
const User = require('../models/User');
const ViGiaoDich = require('../models/ViGiaoDich');
const { register } = require('../validators/userValidator');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { error } = register.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ error: 'Email đã tồn tại' });

    const user = new User(req.body);
    const wallet = new ViGiaoDich({ owner: user._id, ownerModel: 'User' });
    await wallet.save();
    user.wallet = wallet._id;
    await user.save();

    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deposit/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('wallet');
    if (!user) return res.status(404).json({ error: 'User không tồn tại' });

    const amount = req.body.amount;
    if (amount < 10000) return res.status(400).json({ error: 'Tối thiểu 10,000 VND' });

    user.wallet.balance += amount;
    await user.wallet.save();

    await new (require('../models/GiaoDichVi'))({
      wallet: user.wallet._id,
      amount,
      type: 'deposit',
      description: `Nạp tiền ${amount} VND`
    }).save();

    res.json({ message: 'Nạp tiền thành công', newBalance: user.wallet.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;