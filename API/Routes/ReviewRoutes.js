const express = require("express");
const asyncHandler = require("express-async-handler");

function createReviewRoutes(reviewController, authenticate, authorize) {
  const router = express.Router();

  // 📖 PUBLIC - anyone can view reviews
  router.get(
    "/:bookId/reviews",
    asyncHandler(reviewController.getReviewsByBook.bind(reviewController)),
  );

  // 📖 PUBLIC - anyone can view rating
  router.get(
    "/:bookId/rating",
    asyncHandler(reviewController.getBookRating.bind(reviewController)),
  );

  // 🔒 PROTECTED - logged-in users can create reviews
  router.post(
    "/:bookId/reviews",
    authenticate,
    authorize("USER", "ADMIN"),
    asyncHandler(reviewController.createReview.bind(reviewController)),
  );

  return router;
}

module.exports = createReviewRoutes;
