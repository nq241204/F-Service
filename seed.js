// seed.js
require('dotenv').config(); // Thêm dòng này để load file .env
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Service = require('./models/Service');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Xóa dữ liệu cũ
    await User.deleteMany();
    await Service.deleteMany();

    // Thêm user mẫu
    const user = await User.create({
      email: 'test@example.com',
      password: await bcrypt.hash('123456', 10),
      role: 'user',
      balance: 1000000,
    });

    // Thêm dịch vụ mẫu
    await Service.create({
      title: 'Dịch vụ test 1',
      description: 'Mô tả dịch vụ test',
      user: user._id,
      status: 'pending',
      price: 500000,
    });

    console.log('Dữ liệu mẫu đã được thêm!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu:', error);
    process.exit(1);
  }
};

seedData();