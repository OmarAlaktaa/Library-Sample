const express = require("express");
const asyncHandler = require("express-async-handler");

// Routes layer to define API endpoints related to books
function createBookRoutes(bookController) {
  const router = express.Router();

  // Mapping HTTP Verbs and Route Paths to Controller Methods

  router.get("/", asyncHandler(bookController.getAllBooks));

  router.post("/", asyncHandler(bookController.addBook));

  router.get("/:id", asyncHandler(bookController.getBookById));

  router.put("/:id", asyncHandler(bookController.updateBook));

  router.delete("/:id", asyncHandler(bookController.deleteBook));

  return router;
}

module.exports = createBookRoutes;
