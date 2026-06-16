const BookDTO = require("../../Application/DTOs/BookDTO");
const logger = require("../../Infrastructure/Logging/logger");

// Controller layer to handle HTTP requests related to books
class BookController {
  constructor(bookService) {
    this.bookService = bookService;
  }

  getAllBooks = async (req, res) => {
    const books = await this.bookService.getAllBooks();

    const responseData = books.map((book) => BookDTO.toResponse(book));

    logger.info("All books retrieved successfully", "BookController", {
      count: books.length,
    });

    return res.status(200).json(responseData);
  };

  getBookById = async (req, res) => {
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
  };

  addBook = async (req, res) => {
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
  };

  updateBook = async (req, res) => {
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
  };

  deleteBook = async (req, res) => {
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
  };
}
module.exports = BookController;
