class ReviewNotFoundException extends Error {
  constructor(message = "Review not found") {
    super(message);
    this.name = "ReviewNotFoundException";
    this.statusCode = 404;
    this.code = "REVIEW_NOT_FOUND";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ReviewNotFoundException;
