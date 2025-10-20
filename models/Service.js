const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  price: { type: Number },
  aiPrice: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', ServiceSchema);