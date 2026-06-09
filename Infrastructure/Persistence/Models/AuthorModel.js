const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, auto: true, required: true },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    birthDate: { type: Date, required: true },
    bio: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

// Creating real model from the schema and exporting it
const Author = mongoose.model("Author", AuthorSchema);
module.exports = Author;
