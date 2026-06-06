const AuthorModel = require("../Models/AuthorModel");
const Author = require("../../../Domain/Entities/Author");

class MongoAuthorRepository {
  // Helper to map a mongoose document to our pure Domain Entity
  _mapToEntity(doc) {
    if (!doc) return null;
    return new Author(doc._id.toString(), doc.name, doc.birthDate, doc.bio);
  }

  async getAllAuthors() {
    const docs = await AuthorModel.find();
    return docs.map(this._mapToEntity);
  }

  async getAuthorById(id) {
    try {
      const doc = await AuthorModel.findById(id);
      return this._mapToEntity(doc);
    } catch (err) {
      return null;
    }
  }

  async saveNewAuthor(author) {
    // 1. Find the highest existing ID
    const lastAuthor = await AuthorModel.findOne().sort({ _id: -1 });
    const newId = lastAuthor && lastAuthor._id ? lastAuthor._id + 1 : 1;

    const newDoc = new AuthorModel({
      _id: newId,
      name: author.name,
      birthDate: author.birthDate,
      bio: author.bio,
    });
    const savedDoc = await newDoc.save();
    return this._mapToEntity(savedDoc);
  }

  async updateAuthor(id, updatedAuthor) {
    try {
      const doc = await AuthorModel.findByIdAndUpdate(
        id,
        {
          name: updatedAuthor.name,
          birthDate: updatedAuthor.birthDate,
          bio: updatedAuthor.bio,
        },
        { new: true },
      );
      return this._mapToEntity(doc);
    } catch (err) {
      return null;
    }
  }

  async deleteAuthor(id) {
    try {
      await AuthorModel.findByIdAndDelete(id);
    } catch (err) {
      // ignore
    }
  }
}

module.exports = MongoAuthorRepository;
