const Joi = require("joi");

const createBookSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),

  authorId: Joi.string().required(),

  price: Joi.number().min(0).required(),

  ISBN: Joi.string().required(),
});

// This file returns the validation schema for creating a book,
// which can be used in the controller to validate incoming requests before processing them.
module.exports = createBookSchema;
