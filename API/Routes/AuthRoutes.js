const express = require("express");
const asyncHandler = require("express-async-handler");

// Routes layer to define API endpoints related to books
function createAuthRoutes(authController) {
  // Mapping HTTP Verbs and Route Paths to Controller Methods
  const router = express.Router();

  router.post(
    "/register",
    asyncHandler(authController.register.bind(authController)),
  );

  router.post(
    "/login",
    asyncHandler(authController.login.bind(authController)),
  );
  return router;
}
module.exports = createAuthRoutes;
