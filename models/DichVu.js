const mongoose = require('mongoose');

const dichVuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên dịch vụ là bắt buộc'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Mô tả là bắt buộc'],
    maxlength: 500
  },
  basePrice: {
    type: Number,
    required: [true, 'Giá cơ bản là bắt buộc'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Danh mục là bắt buộc'],
    enum: ['food', 'drink', 'repair', 'tutor', 'other']
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DichVu', dichVuSchema);