const mongoose = require('mongoose');

const uyThacSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DichVu',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0 // Giá thay đổi theo level của Member
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UyThac', uyThacSchema);