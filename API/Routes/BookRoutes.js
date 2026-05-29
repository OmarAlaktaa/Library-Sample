const express = require("express");
// Routes layer to define API endpoints related to books
function createBookRoutes(bookController) {
  const router = express.Router();

  // Mapping HTTP Verbs and Route Paths to Controller Methods

  router.get("/", bookController.getAllBooks);

  router.post("/", bookController.addBook);

  router.get("/:id", bookController.getBookById);

  router.put("/:id", bookController.updateBook);

  router.delete("/:id", bookController.deleteBook);

  return router;
}

module.exports = createBookRoutes;
