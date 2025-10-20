const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [String],
  level: { type: String, enum: ['Intern', 'Thành thạo', 'Chuyên gia'], default: 'Intern' },
  certifications: [String],
  rating: { type: Number, default: 0 },
  completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
});

module.exports = mongoose.model('Member', MemberSchema);