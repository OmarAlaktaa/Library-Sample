const BookDTO = require("../../Application/DTOs/BookDTO");

// Controller layer to handle HTTP requests related to books
class BookController {
  constructor(bookService) {
    this.bookService = bookService;
  }

  // Using arrow functions to preserve 'this' context when used as route callbacks
  getAllBooks = async (req, res) => {
    try {
      const books = await this.bookService.getAllBooks();
      // Use DTO to format out internal domains before sending data to the client
      const responseData = books.map((book) => BookDTO.toResponse(book));
      return res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  /**
   * @desc Get a book by ID
   * @route GET /books/:id
   * @access public
   */
  getBookById = async (req, res) => {
    try {
      const bookId = parseInt(req.params.id);
      // If the book does not exist, the Service will throw a BookNotFoundException
      const book = await this.bookService.getBookById(bookId);

      // Use DTO to safely format the entity data for the client
      const responseData = BookDTO.toResponse(book);
      return res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      if (error.name === "BookNotFoundException") {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  /**
   * @desc   Add a new book
   * @route  POST /books
   * @access public
   */
  addBook = async (req, res) => {
    try {
      // DTO filters and sanitizes user input preventing mass-assignment attacks
      const safeData = BookDTO.fromRequest(req.body);
      const newBook = await this.bookService.addBook(safeData);

      // 201 status code means "Created Successfully"
      const responseData = BookDTO.toResponse(newBook);
      return res.status(201).json(responseData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create book" });
    }
  };

  /**
   *
   * @desc Update a book
   * @route PUT /books/:id
   * @access public
   */
  updateBook = async (req, res) => {
    try {
      // Ensure only the explicitly allowed fields from the client can reach the service layer
      const safeData = BookDTO.fromRequest(req.body);
      const updatedBook = await this.bookService.updateBook(parseInt(req.params.id), safeData);
      
      const responseData = BookDTO.toResponse(updatedBook);
      return res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      if (error.name === "BookNotFoundException") {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to update book" });
    }
  };

  /**
   * @desc Delete a book
   * @route DELETE /books/:id
   * @access public
   */
  deleteBook = async (req, res) => {
    try {
      await this.bookService.deleteBook(parseInt(req.params.id));
      return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error(error);
      if (error.name === "BookNotFoundException") {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to delete book" });
    }
  };
}

module.exports = BookController;
