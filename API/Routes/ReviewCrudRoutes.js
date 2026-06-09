const express = require("express");

function createReviewCrudRoutes({ reviewController, authenticate, authorize }) {
  const router = express.Router();

  // GET /reviews/:id
  router.get("/:id", (req, res, next) =>
    reviewController.getReviewById(req, res, next),
  );

  // PUT /reviews/:id
  router.put("/:id", authenticate, (req, res, next) =>
    reviewController.updateReview(req, res, next),
  );

  // DELETE /reviews/:id
  router.delete("/:id", authenticate, (req, res, next) =>
    reviewController.deleteReview(req, res, next),
  );

  // DELETE /reviews/admin/:id
  router.delete(
    "/admin/:id",
    authenticate,
    authorize("ADMIN"),
    (req, res, next) => reviewController.deleteReview(req, res, next),
  );

  return router;
}

module.exports = createReviewCrudRoutes;
