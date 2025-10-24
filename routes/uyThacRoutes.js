const express = require('express');
const UyThac = require('../models/UyThac');
const User = require('../models/User');
const Member = require('../models/Member');
const { create } = require('../validators/uyThacValidator');
const { processPayment } = require('../utils/escrow');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { error } = create.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findById(req.body.user).populate('wallet');
    if (!user) return res.status(404).json({ error: 'User không tồn tại' });

    const member = await Member.findById(req.body.member).populate('wallet');
    if (!member) return res.status(404).json({ error: 'Member không tồn tại' });

    const uyThac = new UyThac({ ...req.body, user: user._id, member: member._id });
    await uyThac.save();

    const result = await processPayment(user.wallet._id, member.wallet._id, req.body.price, uyThac._id);
    if (!result.success) throw new Error(result.error);

    res.status(201).json({ message: 'Ủy thác tạo thành công', uyThacId: uyThac._id, payment: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;