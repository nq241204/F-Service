const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'member', 'admin'], default: 'user' },
  balance: { type: Number, default: 0 },
  isVip: { type: Boolean, default: false },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
});

module.exports = mongoose.model('User', UserSchema);