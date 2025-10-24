const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Tên đăng nhập là bắt buộc'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: 6
  },
  level: {
    type: String,
    enum: ['Intern', 'Tho', 'ChuyenGia'],
    default: 'Intern'
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DichVu'
  }],
  cv: {
    type: String, // URL hoặc nội dung CV/bằng cấp
    default: ''
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ViGiaoDich',
    required: true
  },
  completedTasks: {
    type: Number,
    default: 0 // Để theo dõi số nhiệm vụ hoàn thành, hỗ trợ thăng cấp
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

memberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

memberSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Member', memberSchema);