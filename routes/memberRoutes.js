const express = require('express');
const Member = require('../models/Member');
const ViGiaoDich = require('../models/ViGiaoDich');
const { register } = require('../validators/memberValidator');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { error } = register.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const existingMember = await Member.findOne({ email: req.body.email });
    if (existingMember) return res.status(400).json({ error: 'Email đã tồn tại' });

    const member = new Member(req.body);
    const wallet = new ViGiaoDich({ owner: member._id, ownerModel: 'Member' });
    await wallet.save();
    member.wallet = wallet._id;
    await member.save();

    res.status(201).json({ message: 'Member created', memberId: member._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/upgrade/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member không tồn tại' });

    if (member.completedTasks >= 10 && member.level === 'Intern') {
      member.level = 'Tho';
    } else if (member.completedTasks >= 50 && member.level === 'Tho') {
      member.level = 'ChuyenGia';
    } else {
      return res.status(400).json({ error: 'Chưa đủ điều kiện thăng cấp' });
    }

    await member.save();
    res.json({ message: 'Thăng cấp thành công', level: member.level });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;