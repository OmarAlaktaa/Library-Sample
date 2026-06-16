const express = require("express");
const asyncHandler = require("express-async-handler");

function createReviewCrudRoutes({ reviewController, authenticate, authorize }) {
  const router = express.Router();

  // GET /reviews/:id
  router.get(
    "/:id",
    asyncHandler(reviewController.getReviewById.bind(reviewController)),
  );

  // PUT /reviews/:id
  router.put(
    "/:id",
    authenticate,
    authorize("USER", "ADMIN"),
    asyncHandler(reviewController.updateReview.bind(reviewController)),
  );

  // DELETE /reviews/:id
  router.delete(
    "/:id",
    authorize("USER", "ADMIN"),
    authenticate,
    asyncHandler(reviewController.deleteReview.bind(reviewController)),
  );

  // DELETE /reviews/admin/:id
  router.delete(
    "/admin/:id",
    authenticate,
    authorize("ADMIN"),
    asyncHandler(reviewController.deleteReview.bind(reviewController)),
  );

  return router;
}

module.exports = createReviewCrudRoutes;
