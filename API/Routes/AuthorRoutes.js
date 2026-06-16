const express = require("express");
const asyncHandler = require("express-async-handler");

function createAuthorRoutes(authorController, authenticate, authorize) {
  const router = express.Router();

  // 📖 PUBLIC - anyone can read authors
  router.get(
    "/",
    asyncHandler(authorController.getAllAuthors.bind(authorController)),
  );

  router.get(
    "/:id",
    asyncHandler(authorController.getAuthorById.bind(authorController)),
  );

  // 🔒 PROTECTED - only ADMIN can create authors
  router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    asyncHandler(authorController.addAuthor.bind(authorController)),
  );

  // 🔒 PROTECTED - only ADMIN can update authors
  router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    asyncHandler(authorController.updateAuthor.bind(authorController)),
  );

  // 🔒 PROTECTED - only ADMIN can delete authors
  router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    asyncHandler(authorController.deleteAuthor.bind(authorController)),
  );

  return router;
}

module.exports = createAuthorRoutes;
