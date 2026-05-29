const express = require("express");
function createAuthorRoutes(authorController) {
  const router = express.Router();
  // Mapping HTTP Verbs and Route Paths to Controller Methods

  router.get("/", authorController.getAllAuthors);
  router.post("/", authorController.addAuthor);
  router.get("/:id", authorController.getAuthorById);
  router.put("/:id", authorController.updateAuthor);
  router.delete("/:id", authorController.deleteAuthor);

  return router;
}

module.exports = createAuthorRoutes;
