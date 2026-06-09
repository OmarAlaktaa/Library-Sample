const logger = require("../../Infrastructure/Logging/logger");

function ErrorHandler(error, req, res, next) {
  // Expected business exceptions
  const knownExceptions = [
    "BookNotFoundException",
    "AuthorNotFoundException",
    "ReviewNotFoundException",
    "DuplicateReviewException",
    "ReviewOwnershipException",
    "InvalidReviewRatingException",
    "InvalidReviewCommentException",
    "InvalidCredentialsException",
  ];

  console.log(error);

  if (knownExceptions.includes(error.name)) {
    logger.warn(error.message, "ErrorHandler", {
      path: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.error("Unhandled application error", "ErrorHandler", {
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
    });
  }

  // Resource Not Found
  if (
    error.name === "BookNotFoundException" ||
    error.name === "AuthorNotFoundException" ||
    error.name === "ReviewNotFoundException"
  ) {
    return res.status(error.statusCode || 404).json({
      error: error.message,
    });
  }

  // Authentication
  if (error.name === "InvalidCredentialsException") {
    return res.status(error.statusCode || 401).json({
      error: error.message,
    });
  }

  // Authorization
  if (error.name === "ReviewOwnershipException") {
    return res.status(error.statusCode || 403).json({
      error: error.message,
    });
  }

  // Validation
  if (
    error.name === "InvalidReviewRatingException" ||
    error.name === "InvalidReviewCommentException"
  ) {
    return res.status(error.statusCode || 400).json({
      error: error.message,
    });
  }

  // Conflict
  if (error.name === "DuplicateReviewException") {
    return res.status(error.statusCode || 409).json({
      error: error.message,
    });
  }

  // Mongo unique index violation
  if (error.code === 11000) {
    return res.status(409).json({
      error: "Duplicate resource",
    });
  }

  // Unexpected error
  return res.status(500).json({
    error: "Internal Server Error",
  });
}

module.exports = ErrorHandler;
