const Author = require("../../Domain/Entities/Author");
const AuthorNotFoundException = require("../../Domain/Exceptions/AuthorNotFoundException");

class AuthorService {
  constructor(authorRepository) {
    this.authorRepository = authorRepository;
  }

  async getAllAuthors() {
    return await this.authorRepository.getAllAuthors();
  }

  async getAuthorById(id) {
    const author = await this.authorRepository.getAuthorById(id);
    if (!author) {
      throw new AuthorNotFoundException(id);
    } else {
      return author;
    }
  }

  async addAuthor(authorData) {
    // We pass null for the ID because the database will generate it
    const newAuthor = new Author(
      null,
      authorData.name ?? "Unknown Author",
      authorData.bio ?? "No biography available",
    );
    return await this.authorRepository.saveNewAuthor(newAuthor);
  }

  async updateAuthor(id, newAuthorData) {
    const existingAuthor = await this.authorRepository.getAuthorById(id);
    if (!existingAuthor) {
      throw new AuthorNotFoundException(id);
    } else {
      existingAuthor.name = newAuthorData.name ?? existingAuthor.name;
      existingAuthor.birthDate =
        newAuthorData.birthDate ?? existingAuthor.birthDate;
      existingAuthor.bio = newAuthorData.bio ?? existingAuthor.bio;

      return await this.authorRepository.updateAuthor(id, existingAuthor);
    }
  }

  async deleteAuthor(id) {
    const existingAuthor = await this.authorRepository.getAuthorById(id);
    if (!existingAuthor) {
      throw new AuthorNotFoundException(id);
    } else {
      return await this.authorRepository.deleteAuthor(id);
    }
  }
}

module.exports = AuthorService;
