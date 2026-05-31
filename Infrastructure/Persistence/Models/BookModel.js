const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    price: { type: Number, required: true, min: 0 },
    ISBN: { type: String, required: true },
  },
  { timestamps: true },
);

// Creating real model from the schema and exporting it
const Book = mongoose.model("Book", BookSchema);
module.exports = Book;
