const Book = require("../../Domain/Entities/Book");
const BookNotFoundException = require("../../Domain/Exceptions/BookNotFoundException");

// Service layer to handle business logic related to books
class BookService {
  constructor(bookRepository) {
    // We inject the dependency to stick to Hexagonal Architecture
    this.bookRepository = bookRepository;
  }

  async getAllBooks() {
    return await this.bookRepository.getAllBooks();
  }

  async getBookById(id) {
    const book = await this.bookRepository.getBookById(id);
    if (!book) {
      throw new BookNotFoundException(id);
    }
    return book;
  }

  async addBook(bookData) {
    // Domain business logic: Instantiating the entity
    // We pass null for the ID because the database will generate it
    const newBook = new Book(
      null,
      bookData.title ?? "Untitled Book",
      bookData.author ?? "Unknown Author",
      bookData.price ?? 0,
      bookData.ISBN ?? "Unknown ISBN",
    );

    return await this.bookRepository.saveNewBook(newBook);
  }

  async updateBook(id, newBookData) {
    const existingBook = await this.bookRepository.getBookById(id);
    if (!existingBook) {
      throw new BookNotFoundException(id);
    } else {
      existingBook.title = newBookData.title ?? existingBook.title;
      existingBook.author = newBookData.author ?? existingBook.author;
      existingBook.price = newBookData.price ?? existingBook.price;
      existingBook.ISBN = newBookData.ISBN ?? existingBook.ISBN;
    }

    // Use the repository's updateBook method instead of saveBook
    return await this.bookRepository.updateBook(id, existingBook);
  }

  async deleteBook(id) {
    if (!this.bookRepository.getBookById(id)) {
      throw new BookNotFoundException(id);
    } else {
      this.bookRepository.deleteBook(id);
    }
  }
}

module.exports = BookService;
