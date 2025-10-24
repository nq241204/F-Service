const Joi = require('joi');

const depositValidationSchema = Joi.object({
  amount: Joi.number()
    .min(10000) // Giả sử đơn vị tiền là VND, tối thiểu 10k
    .required()
    .messages({
      'number.min': 'Số tiền nạp tối thiểu là 10,000 VND',
      'any.required': 'Số tiền là bắt buộc'
    })
});

module.exports = {
  deposit: depositValidationSchema
};