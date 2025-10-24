const mongoose = require('mongoose');

const viGiaoDichSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'ownerModel',
    required: true
  },
  ownerModel: {
    type: String,
    enum: ['User', 'Member'],
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GiaoDichVi'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ViGiaoDich', viGiaoDichSchema);