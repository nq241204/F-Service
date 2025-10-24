const ViGiaoDich = require('../models/ViGiaoDich');
const GiaoDichVi = require('../models/GiaoDichVi');

const processPayment = async (userWalletId, memberWalletId, amount, uyThacId) => {
  try {
    const userWallet = await ViGiaoDich.findById(userWalletId);
    if (userWallet.balance < amount) throw new Error('Số dư không đủ');

    userWallet.balance -= amount;
    await userWallet.save();
    await new GiaoDichVi({
      wallet: userWalletId,
      amount: -amount,
      type: 'payment',
      description: `Thanh toán ủy thác ${uyThacId}`
    }).save();

    const memberAmount = amount * 0.95;
    const systemAmount = amount * 0.05;
    const memberWallet = await ViGiaoDich.findById(memberWalletId);
    memberWallet.balance += memberAmount;
    await memberWallet.save();
    await new GiaoDichVi({
      wallet: memberWalletId,
      amount: memberAmount,
      type: 'payment',
      description: `Nhận thanh toán từ ủy thác ${uyThacId}`
    }).save();

    return { success: true, memberAmount, systemAmount };
  } catch (error) {
    throw error;
  }
};

module.exports = { processPayment };