class DuplicateReviewException extends Error {
  constructor(message = "You have already reviewed this book") {
    super(message);
    this.name = "DuplicateReviewException";
    this.statusCode = 409; // 409 Conflict
    this.code = "DUPLICATE_REVIEW";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = DuplicateReviewException;
