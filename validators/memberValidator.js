const Joi = require('joi');

const memberValidationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Tên đăng nhập phải ít nhất 3 ký tự',
    'string.max': 'Tên đăng nhập không quá 30 ký tự',
    'any.required': 'Tên đăng nhập là bắt buộc'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().min(6).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')).required().messages({
    'string.min': 'Mật khẩu phải ít nhất 6 ký tự',
    'string.pattern.base': 'Mật khẩu phải có chữ thường, hoa và số',
    'any.required': 'Mật khẩu là bắt buộc'
  }),
  level: Joi.string().valid('Intern', 'Tho', 'ChuyenGia').default('Intern'),
  cv: Joi.string().optional()
});

module.exports = {
  register: memberValidationSchema,
  update: memberValidationSchema
};