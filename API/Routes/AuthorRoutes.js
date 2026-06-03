const express = require("express");
const asyncHandler = require("express-async-handler");

function createAuthorRoutes(authorController) {
  const router = express.Router();
  // Mapping HTTP Verbs and Route Paths to Controller Methods

  router.get("/", asyncHandler(authorController.getAllAuthors));
  router.post("/", asyncHandler(authorController.addAuthor));
  router.get("/:id", asyncHandler(authorController.getAuthorById));
  router.put("/:id", asyncHandler(authorController.updateAuthor));
  router.delete("/:id", asyncHandler(authorController.deleteAuthor));

  return router;
}

module.exports = createAuthorRoutes;
