const express = require("express");

function createReviewRoutes({ reviewController, authenticate }) {
  const router = express.Router();

  // GET /books/:bookId/reviews
  router.get("/:bookId/reviews", (req, res, next) =>
    reviewController.getReviewsByBook(req, res, next),
  );

  // GET /books/:bookId/rating
  router.get("/:bookId/rating", (req, res, next) =>
    reviewController.getBookRating(req, res, next),
  );

  // POST /books/:bookId/reviews
  router.post("/:bookId/reviews", authenticate, (req, res, next) =>
    reviewController.createReview(req, res, next),
  );

  return router;
}

module.exports = createReviewRoutes;
