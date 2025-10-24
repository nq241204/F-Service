const Joi = require('joi');

const uyThacValidationSchema = Joi.object({
  user: Joi.string()
    .required()
    .messages({ 'any.required': 'User ID là bắt buộc' }),
  member: Joi.string()
    .required()
    .messages({ 'any.required': 'Member ID là bắt buộc' }),
  service: Joi.string()
    .required()
    .messages({ 'any.required': 'Dịch vụ ID là bắt buộc' }),
  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Giá phải lớn hơn hoặc bằng 0',
      'any.required': 'Giá là bắt buộc'
    })
});

module.exports = {
  create: uyThacValidationSchema
};