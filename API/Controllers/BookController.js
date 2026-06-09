const BookDTO = require("../../Application/DTOs/BookDTO");
const logger = require("../../Infrastructure/Logging/logger");

// Controller layer to handle HTTP requests related to books
class BookController {
  constructor(bookService) {
    this.bookService = bookService;
  }

  getAllBooks = async (req, res) => {
    try {
      const books = await this.bookService.getAllBooks();

      const responseData = books.map((book) => BookDTO.toResponse(book));

      logger.info("All books retrieved successfully", "BookController", {
        count: books.length,
      });

      return res.status(200).json(responseData);
    } catch (error) {
      logger.error("Failed to retrieve books", "BookController", {
        message: error.message,
        stack: error.stack,
      });

      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  };

  getBookById = async (req, res) => {
    try {
      const bookId = req.params.id;

      const book = await this.bookService.getBookById(bookId);

      const responseData = BookDTO.toResponse(book);

      logger.info(
        `Book with Id=${bookId} retrieved successfully`,
        "BookController",
        {
          bookId,
        },
      );

      return res.status(200).json(responseData);
    } catch (error) {
      if (error.name === "BookNotFoundException") {
        logger.warn("Book not found", "BookController", {
          bookId: req.params.id,
        });

        return res.status(error.statusCode).json({
          error: error.message,
        });
      }

      logger.error(
        `Failed to retrieve book with Id=${req.params.id}`,
        "BookController",
        {
          message: error.message,
          stack: error.stack,
          bookId: req.params.id,
        },
      );

      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  };

  addBook = async (req, res) => {
    try {
      const safeData = BookDTO.fromRequest(req.body);
      const newBook = await this.bookService.addBook(safeData);
      const responseData = BookDTO.toResponse(newBook);

      logger.info(
        `Book created successfully, BookId=${newBook.id}`,
        "BookController",
        {
          bookId: newBook.id,
        },
      );

      return res.status(201).json(responseData);
    } catch (error) {
      logger.error(
        `Failed to create book with Id=${req.params.id}`,
        "BookController",
        {
          message: error.message,
          stack: error.stack,
        },
      );

      return res.status(500).json({
        error: "Failed to create book",
      });
    }
  };

  updateBook = async (req, res) => {
    try {
      const bookId = req.params.id;
      const safeData = BookDTO.fromRequest(req.body);

      const updatedBook = await this.bookService.updateBook(bookId, safeData);

      const responseData = BookDTO.toResponse(updatedBook);

      logger.info(
        `Book with Id=${bookId} updated successfully`,
        "BookController",
        {
          bookId,
        },
      );

      return res.status(200).json(responseData);
    } catch (error) {
      if (error.name === "BookNotFoundException") {
        logger.warn("Book not found for update", "BookController", {
          bookId: req.params.id,
        });

        return res.status(error.statusCode).json({
          error: error.message,
        });
      }

      logger.error("Failed to update book", "BookController", {
        message: error.message,
        stack: error.stack,
        bookId: req.params.id,
      });

      return res.status(500).json({
        error: "Failed to update book",
      });
    }
  };

  deleteBook = async (req, res) => {
    try {
      const bookId = req.params.id;

      await this.bookService.deleteBook(bookId);

      logger.info(
        `Book with Id=${bookId} deleted successfully`,
        "BookController",
        {
          bookId,
        },
      );

      return res.status(200).json({
        message: "Book deleted successfully",
      });
    } catch (error) {
      if (error.name === "BookNotFoundException") {
        logger.warn(
          `Book with Id=${req.params.id} not found for deletion`,
          "BookController",
          {
            bookId: req.params.id,
          },
        );

        return res.status(error.statusCode).json({
          error: error.message,
        });
      }

      logger.error(
        `Failed to delete book with Id=${req.params.id}`,
        "BookController",
        {
          message: error.message,
          stack: error.stack,
          bookId: req.params.id,
        },
      );

      return res.status(500).json({
        error: "Failed to delete book",
      });
    }
  };
}

module.exports = BookController;
