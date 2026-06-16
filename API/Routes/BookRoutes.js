const express = require("express");
const asyncHandler = require("express-async-handler");

function createBookRoutes(bookController, authenticate, authorize) {
  const router = express.Router();

  // 📖 PUBLIC - anyone can read books
  router.get(
    "/",
    asyncHandler(bookController.getAllBooks.bind(bookController)),
  );

  router.get(
    "/:id",
    asyncHandler(bookController.getBookById.bind(bookController)),
  );

  // 🔒 PROTECTED - only logged-in users can create books
  router.post(
    "/",
    authenticate,
    authorize("ADMIN"), // change if you want USER also
    asyncHandler(bookController.addBook.bind(bookController)),
  );

  // 🔒 PROTECTED - update book
  router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    asyncHandler(bookController.updateBook.bind(bookController)),
  );

  // 🔒 PROTECTED - delete book
  router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    asyncHandler(bookController.deleteBook.bind(bookController)),
  );

  return router;
}

module.exports = createBookRoutes;
