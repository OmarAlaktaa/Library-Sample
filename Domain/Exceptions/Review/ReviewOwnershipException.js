/**
 * @class ReviewOwnershipException
 * @description Domain exception thrown when a user attempts to modify
 * or delete a review they do not own (and is not an admin).
 * Enforces authorization at the domain level.
 */
class ReviewOwnershipException extends Error {
  /**
   * @param {string} message - Optional custom error message
   */
  constructor(message = 'You are not authorized to modify this review') {
    super(message);
    this.name = 'ReviewOwnershipException';
    this.statusCode = 403;
    this.code = 'REVIEW_OWNERSHIP_VIOLATION';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ReviewOwnershipException;
