const express = require("express");
const config = require("./config");
const logger = require("./Infrastructure/Logging/logger");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Infrastructure Layer -- Importing Repositories
const MongoBookRepository = require("./Infrastructure/Persistence/ModelsRepositories/MongoBookRepository");
const MongoAuthorRepository = require("./Infrastructure/Persistence/ModelsRepositories/MongoAuthorRepository");
const MongoUserRepository = require("./Infrastructure/Persistence/ModelsRepositories/MongoUserRepository");
const MongoReviewRepository = require("./Infrastructure/Persistence/ModelsRepositories/MongoReviewRepository");
const MongoRefreshTokenRepository = require("./Infrastructure/Persistence/ModelsRepositories/MongoRefreshTokenRepository");

// Application Layer -- Importing Services
const BookService = require("./Application/Services/BookService");
const AuthorService = require("./Application/Services/AuthorService");
const ReviewService = require("./Application/Services/ReviewService");
const AuthService = require("./Application/Services/AuthService");

// API Layer -- Importing Controllers
const BookController = require("./API/Controllers/BookController");
const AuthorController = require("./API/Controllers/AuthorController");
const ReviewController = require("./API/Controllers/ReviewController");
const AuthController = require("./API/Controllers/AuthController");

// Security Layer -- Importing Utilities
const PasswordHasher = require("./Infrastructure/Security/PasswordHasher");
const TokenService = require("./Infrastructure/Security/TokenService");

// Routes -- Importing Route Creators
const createBookRoutes = require("./API/Routes/BookRoutes");
const createAuthorRoutes = require("./API/Routes/AuthorRoutes");
const createReviewRoutes = require("./API/Routes/ReviewRoutes");
const createReviewCrudRoutes = require("./API/Routes/ReviewCrudRoutes");
const createAuthRoutes = require("./API/Routes/AuthRoutes");

const passwordHasher = new PasswordHasher(config.security.saltRounds);
const tokenService = new TokenService(
  config.security.jwtSecret,
  config.security.jwtSecret,
  logger,
);

// Composition Root
// Dependency Injection

// Repositories
const userRepository = new MongoUserRepository();
const bookRepository = new MongoBookRepository();
const authorRepository = new MongoAuthorRepository();
const reviewRepository = new MongoReviewRepository({ logger });
const refreshTokenRepository = new MongoRefreshTokenRepository(logger);

// Services
const bookService = new BookService(bookRepository);
const authorService = new AuthorService(authorRepository);
const authService = new AuthService(
  userRepository,
  refreshTokenRepository,
  passwordHasher,
  tokenService,
  logger,
);
const reviewService = new ReviewService(
  reviewRepository,
  bookRepository,
  logger,
);

// Initializing Controllers
const bookController = new BookController(bookService);
const authorController = new AuthorController(authorService);
const reviewController = new ReviewController(reviewService, logger);
const authController = new AuthController(authService);

// Custom Middlewares
const AuthMiddleware = require("./Infrastructure/Security/AuthMiddleware");

// This is an instance of the AuthMiddleware class,
// which allows us to use its methods with access to the TokenService instance
const authMiddleware = new AuthMiddleware(tokenService);

function authenticate(req, res, next) {
  authMiddleware.verifyToken(req, res, next);
}

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };

// Routers
const bookRoutes = createBookRoutes(bookController, authenticate, authorize);
const authorRoutes = createAuthorRoutes(
  authorController,
  authenticate,
  authorize,
);
const authRoutes = createAuthRoutes(authController);
const reviewRoutes = createReviewRoutes(
  reviewController,
  authenticate,
  authorize,
);
const reviewCrudRoutes = createReviewCrudRoutes({
  reviewController,
  authenticate,
  authorize,
});

// Route Registration
app.get("/", (req, res) => {
  res.send("Welcome to my clean architecture API!");
});

app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);
app.use("/books", reviewRoutes);
app.use("/reviews", reviewCrudRoutes);
app.use("/auth", authRoutes);

const errorHandler = require("./API/Middleware/ErrorHandler");
app.use(errorHandler); // Global error handler

module.exports = app;
