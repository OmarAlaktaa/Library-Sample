const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Book",
      required: [true, "Book reference is required"],
      index: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      maxlength: 2000,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

reviewSchema.index({ bookId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
