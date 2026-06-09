const BookModel = require("../Models/BookModel");
const Book = require("../../../Domain/Entities/Book");

class MongoBookRepository {
  _mapToEntity(doc) {
    if (!doc) return null;

    return new Book(
      doc._id.toString(),
      doc.title,
      doc.author,
      doc.price,
      doc.ISBN,
    );
  }

  async getAllBooks() {
    const docs = await BookModel.find();
    return docs.map((doc) => this._mapToEntity(doc));
  }

  async getBookById(id) {
    try {
      const doc = await BookModel.findById(id);
      return this._mapToEntity(doc);
    } catch (err) {
      return null;
    }
  }

  async saveNewBook(book) {
    try {
      const newDoc = new BookModel({
        title: book.title,
        author: book.author,
        price: book.price,
        ISBN: book.ISBN,
      });

      const savedDoc = await newDoc.save();

      return this._mapToEntity(savedDoc);
    } catch (err) {
      console.error("Error saving book:", err);
      throw err;
    }
  }

  async updateBook(id, updatedBook) {
    try {
      const doc = await BookModel.findByIdAndUpdate(
        id,
        {
          title: updatedBook.title,
          author: updatedBook.author,
          price: updatedBook.price,
          ISBN: updatedBook.ISBN,
        },
        { returnDocument: "after" },
      );

      return this._mapToEntity(doc);
    } catch (err) {
      console.error("Error updating book:", err);
      return null;
    }
  }

  async deleteBook(id) {
    try {
      await BookModel.findByIdAndDelete(id);
    } catch (err) {
      console.error(err);
    }
  }

  async updateRating(bookId, rating) {
    return BookModel.findByIdAndUpdate(
      bookId,
      { rating },
      { returnDocument: "after" },
    );
  }
}

module.exports = MongoBookRepository;
