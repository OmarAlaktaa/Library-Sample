const BookModel = require("../Models/BookModel");
const Book = require("../../../Domain/Entities/Book");

class MongoBookRepository {
  // Helper to map a mongoose document to our pure Domain Entity
  _mapToEntity(doc) {
    if (!doc) return null;
    return new Book(
      doc._id, // Pass as number
      doc.title,
      doc.author,
      doc.price,
      doc.ISBN,
    );
  }

  async getAllBooks() {
    const docs = await BookModel.find();
    return docs.map(this._mapToEntity);
  }

  async getBookById(id) {
    try {
      const doc = await BookModel.findById(id);
      return this._mapToEntity(doc);
    } catch (err) {
      // If id is not a valid ObjectId, Mongoose throws an error
      return null;
    }
  }

  async saveNewBook(book) {
    // 1. Find the highest existing ID
    const lastBook = await BookModel.findOne().sort({ _id: -1 });
    const newId = lastBook && lastBook._id ? lastBook._id + 1 : 1;

    const newDoc = new BookModel({
      _id: newId,
      title: book.title,
      author: book.author,
      price: book.price,
      ISBN: book.ISBN,
    });
    const savedDoc = await newDoc.save();
    return this._mapToEntity(savedDoc);
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
        { new: true }, // Returns the updated document
      );
      return this._mapToEntity(doc);
    } catch (err) {
      return null;
    }
  }

  async deleteBook(id) {
    try {
      await BookModel.findByIdAndDelete(id);
    } catch (err) {
      // ignore
    }
  }
}

module.exports = MongoBookRepository;
