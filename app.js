const express = require("express");
const connectDB = require("./Infrastructure/Persistence/database");

// Connect to MongoDB
connectDB();

// --- Import Layers / Dependencies ---
const MongoBookRepository = require("./Infrastructure/Persistence/MongoBookRepository");
const MongoAuthorRepository = require("./Infrastructure/Persistence/MongoAuthorRepository");
const BookService = require("./Application/Services/BookService");
const AuthorService = require("./Application/Services/AuthorService");
const BookController = require("./API/Controllers/BookController");
const AuthorController = require("./API/Controllers/AuthorController");
const createBookRoutes = require("./API/Routes/BookRoutes");
const createAuthorRoutes = require("./API/Routes/AuthorRoutes");
const authRoutes = require("./API/Routes/AuthRoutes");

const app = express();

// --- Global Middleware ---
// Applies Middleware to parse JSON bodies in incoming requests.
app.use(express.json());

// --- Composition Root (Dependency Injection) ---
// 1. Storage Backend (Driven Adapter - Infrastructure)
const bookRepository = new MongoBookRepository();
const authorRepository = new MongoAuthorRepository();

// 2. Application Logic (Use Cases - Application)
const bookService = new BookService(bookRepository);
const authorService = new AuthorService(authorRepository);

// 3. Web Delivery (Driving Adapter - Controllers)
const bookController = new BookController(bookService);
const authorController = new AuthorController(authorService);

// 4. API Routes Router Map (API)
const bookRoutes = createBookRoutes(bookController);
const authorRoutes = createAuthorRoutes(authorController);

// --- Route Registrations ---
app.get("/", (req, res) => {
  res.send("Welcome to my clean site!");
});
// Delegate ALL /authors traffic to our dedicated router
app.use("/authors", authorRoutes);

// Delegate ALL /books traffic to our dedicated router
app.use("/books", bookRoutes);

// Delegate ALL /auth traffic to our authentication router
app.use("/auth", authRoutes);

// --- Server Startup ---
const config = require("./config");
app.listen(config.server.port, () => {
  console.log(
    `Server is running with Clean Architecture on port ${config.server.port}`,
  );
});
