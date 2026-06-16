const Joi = require("joi");

const createAuthorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  birthDate: Joi.date().max(new Date()).required(),

  bio: Joi.string().max(1000),
});

// This file returns the validation schema for creating an author,
// which can be used in the controller to validate incoming requests before processing them.
module.exports = createAuthorSchema;
