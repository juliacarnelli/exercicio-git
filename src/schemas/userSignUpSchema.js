const joi = require("joi");

module.exports = joi.object({
  name: joi.string().min(1).max(50).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
