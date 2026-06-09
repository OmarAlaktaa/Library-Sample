const Book = require("../../Domain/Entities/Book");
const BookNotFoundException = require("../../Domain/Exceptions/Book/BookNotFoundException");
const logger = require("../../Infrastructure/Logging/logger");

// Service layer to handle business logic related to books
class BookService {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async getAllBooks() {
    const books = await this.bookRepository.getAllBooks();

    logger.info("All books retrieved successfully", "BookService", {
      count: books.length,
    });

    return books;
  }

  async getBookById(id) {
    const book = await this.bookRepository.getBookById(id);

    if (!book) {
      logger.warn("Book not found", "BookService", {
        bookId: id,
      });

      throw new BookNotFoundException(id);
    }

    logger.info("Book retrieved successfully", "BookService", {
      bookId: book.id,
      title: book.title,
    });

    return book;
  }

  async addBook(bookData) {
    const newBook = new Book(
      null,
      bookData.title ?? "Untitled Book",
      bookData.author ?? "Unknown Author",
      bookData.price ?? 0,
      bookData.ISBN ?? "Unknown ISBN",
    );
    const savedBook = await this.bookRepository.saveNewBook(newBook);
    logger.info("Book created successfully", "BookService", {
      bookId: savedBook.id,
      title: savedBook.title,
    });

    return savedBook;
  }

  async updateBook(id, newBookData) {
    const existingBook = await this.bookRepository.getBookById(id);
    if (!existingBook) {
      logger.warn("Book update failed - book not found", "BookService", {
        bookId: id,
      });

      throw new BookNotFoundException(id);
    }

    existingBook.title = newBookData.title ?? existingBook.title;
    existingBook.author = newBookData.author ?? existingBook.author;
    existingBook.price = newBookData.price ?? existingBook.price;
    existingBook.ISBN = newBookData.ISBN ?? existingBook.ISBN;

    const updatedBook = await this.bookRepository.updateBook(id, existingBook);

    logger.info("Book updated successfully", "BookService", {
      bookId: updatedBook.id,
      title: updatedBook.title,
    });

    return updatedBook;
  }

  async deleteBook(id) {
    const existingBook = await this.bookRepository.getBookById(id);

    if (!existingBook) {
      logger.warn("Book deletion failed - book not found", "BookService", {
        bookId: id,
      });

      throw new BookNotFoundException(id);
    }

    await this.bookRepository.deleteBook(id);

    logger.info("Book deleted successfully", "BookService", {
      bookId: existingBook.id,
      title: existingBook.title,
    });
  }
}

module.exports = BookService;
