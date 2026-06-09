class Review {
  constructor({
    id = null,
    bookId,
    userId,
    rating,
    comment,
    createdAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.bookId = bookId;
    this.userId = userId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  validateRating() {
    if (!Number.isInteger(this.rating) || this.rating < 1 || this.rating > 5) {
      throw new Error("Rating must be an integer between 1 and 5");
    }
  }

  validateComment() {
    if (!this.comment || this.comment.trim().length === 0) {
      throw new Error("Comment is required");
    }
    if (this.comment.length > 2000) {
      throw new Error("Comment must not exceed 2000 characters");
    }
  }

  validate() {
    this.validateRating();
    this.validateComment();
  }

  isOwnedBy(userId) {
    return this.userId === userId;
  }

  static create({ bookId, userId, rating, comment }) {
    const now = new Date();
    return new Review({
      bookId,
      userId,
      rating,
      comment,
      createdAt: now,
      updatedAt: now,
    });
  }
}

module.exports = Review;
