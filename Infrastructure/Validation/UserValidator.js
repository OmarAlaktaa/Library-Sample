const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  email: Joi.string().min(5).max(255).email().required(),

  role: Joi.string().valid("READER", "ADMIN").default("READER").required(),
});

module.exports = createUserSchema;
