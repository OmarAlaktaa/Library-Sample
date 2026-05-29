# 🏗️ Node.js REST API with Clean Architecture

A professional, scalable Node.js HTTP server built with Express and MongoDB. This project was specifically designed to practice and demonstrate **Separation of Concerns** and **Clean Architecture** principles in a backend environment.

## 🚀 Project Overview

The goal of this project is to create a maintainable, testable, and highly decoupled REST API managing a library system (Books and Authors). Rather than coupling the database layer directly with the route handlers, this project meticulously separates the system into distinct layers: Domain, Application, Infrastructure, and API.

It serves as an excellent reference or portfolio piece showcasing enterprise-level structural patterns in Node.js.

## 🛠️ Technologies Used

- **Runtime:** [Node.js](https://nodejs.org/)
- **Web Framework:** [Express.js](https://expressjs.com/) (v5.x)
- **Database:** MongoDB
- **ODM:** [Mongoose](https://mongoosejs.com/)
- **Development Tools:** Nodemon (for auto-reloading)

## 🏛️ Architecture & Structure

This project follows **Clean / Onion Architecture**, adhering strongly to **Separation of Concerns** using a robust dependency injection setup (Composition Root).

```text
├── app.js               # Composition Root & App Entry Point
├── config.js            # Configuration settings (DB URI, Ports)
│
├── API/                 # 🛣️ Driving Adapters (Delivery Layer)
│   ├── Controllers/     # Handles incoming HTTP requests and responses
│   └── Routes/          # Express route definitions pointing to controllers
│
├── Application/         # ⚙️ Use Cases & Data Mapping
│   ├── DTOs/            # Data Transfer Objects
│   └── Services/        # Business logic orchestration (BookService, AuthorService)
│
├── Domain/              # 🧠 Core Business Rules
│   ├── Entities/        # Core business objects (Author.js, Book.js)
│   └── Exceptions/      # Custom domain errors (NotFound exceptions)
│
└── Infrastructure/      # 🔌 Driven Adapters (External Services)
    ├── Persistence/     # DB Connections, Repositories, and Mongoose Models
    ├── Caching/         # Cache logic (Redis, Memory)
    ├── Logging/         # Centralized logging implementations
    └── Security/        # Auth / Crypto tools
```

## ✨ Features

- **Book Management:** Complete CRUD operations for creating, reading, updating, and deleting books.
- **Author Management:** Complete CRUD operations for author profiles.
- **Dependency Injection:** Services and Controllers receive their dependencies via constructors in `app.js`, making unit testing incredibly easy.
- **Centralized Error Handling:** Standardized custom exceptions (e.g., `BookNotFoundException`) to handle edge cases gracefully.
- **Global Payload Parsing:** Built-in middleware to automatically parse JSON incoming requests.

## ⚙️ Environment Setup

Configuration logic is housed inside `config.js`. You can manage settings like database connection strings and server ports there. If you were to adapt this to environment variables, your `.env` would look like this:

```env
# .env.example
PORT=3000
MONGO_URI=mongodb://localhost:27017/LibraryDB
```

## 💻 Installation & Running

1. **Clone the repository**

   ```bash
   git clone <your-github-repo-url>
   cd "HTTP Server in NodeJs"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Ensure MongoDB is running**
   Make sure you have a local MongoDB daemon running on `localhost:27017` or update `config.js` to point to an external cluster.

4. **Start the application**

   ```bash
   # For standard execution
   node app.js

   # For development with real-time reload (via nodemon)
   npx nodemon app.js
   ```

_(Note: You can easily add `"start": "node app.js"` and `"dev": "nodemon app.js"` directly to the scripts section of your `package.json`!)_

## 📡 API Documentation

Base URL: `http://localhost:3000`

### 📚 Books

| Method   | Endpoint     | Description         |
| -------- | ------------ | ------------------- |
| `GET`    | `/books`     | Fetch all books     |
| `GET`    | `/books/:id` | Fetch a single book |
| `POST`   | `/books`     | Create a new book   |
| `PUT`    | `/books/:id` | Update a book       |
| `DELETE` | `/books/:id` | Delete a book       |

### ✍️ Authors

| Method   | Endpoint       | Description           |
| -------- | -------------- | --------------------- |
| `GET`    | `/authors`     | Fetch all authors     |
| `GET`    | `/authors/:id` | Fetch a single author |
| `POST`   | `/authors`     | Create a new author   |
| `PUT`    | `/authors/:id` | Update an author      |
| `DELETE` | `/authors/:id` | Delete an author      |

## 🎓 Learning / Engineering Highlights

- **Modular Architecture:** Easy to swap components. If migrating from MongoDB to PostgreSQL, only the `Infrastructure` repository implementations need changing, seamlessly isolated from `Controllers` and `Services`.
- **Dependency Injection:** Hard-coded `require()` instances are avoided deep in the codebase logic. Everything is passed down from the composition root (`app.js`), honoring the **Inversion of Control** pattern to ensure maximal decoupling.
- **Scalability:** Directories are logically divided so that as the project grows, finding functionality remains predictable and clean without ending up with massive "fat controllers".

---

_Developed with a strong focus on Software Engineering Best Practices._
