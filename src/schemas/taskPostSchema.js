const joi = require("joi");

module.exports = joi.object({
  description: joi.string().required(),
});
