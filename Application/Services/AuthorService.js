const Author = require("../../Domain/Entities/Author");
const AuthorNotFoundException = require("../../Domain/Exceptions/Author/AuthorNotFoundException");
const logger = require("../../Infrastructure/Logging/logger");

class AuthorService {
  constructor(authorRepository) {
    this.authorRepository = authorRepository;
  }

  async getAllAuthors() {
    try {
      const authors = await this.authorRepository.getAllAuthors();

      logger.info("All authors retrieved successfully", "AuthorService", {
        count: authors.length,
      });

      return authors;
    } catch (error) {
      logger.error("Failed to retrieve authors", "AuthorService", {
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }

  async getAuthorById(id) {
    try {
      const author = await this.authorRepository.getAuthorById(id);

      if (!author) {
        logger.warn("Author not found", "AuthorService", {
          authorId: id,
        });

        throw new AuthorNotFoundException(id);
      }

      logger.info("Author retrieved successfully", "AuthorService", {
        authorId: id,
      });

      return author;
    } catch (error) {
      logger.error("Failed to retrieve author", "AuthorService", {
        authorId: id,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }

  async addAuthor(authorData) {
    try {
      const newAuthor = new Author(
        null,
        authorData.name ?? "Unknown Author",
        authorData.birthDate ?? new Date(),
        authorData.bio ?? "No biography available",
      );

      const savedAuthor = await this.authorRepository.saveNewAuthor(newAuthor);

      logger.info("Author created successfully", "AuthorService", {
        authorId: savedAuthor.id,
      });

      return savedAuthor;
    } catch (error) {
      logger.error("Failed to create author", "AuthorService", {
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }

  async updateAuthor(id, newAuthorData) {
    try {
      const existingAuthor = await this.authorRepository.getAuthorById(id);

      if (!existingAuthor) {
        logger.warn("Author not found for update", "AuthorService", {
          authorId: id,
        });

        throw new AuthorNotFoundException(id);
      }

      existingAuthor.name = newAuthorData.name ?? existingAuthor.name;
      existingAuthor.birthDate =
        newAuthorData.birthDate ?? existingAuthor.birthDate;
      existingAuthor.bio = newAuthorData.bio ?? existingAuthor.bio;

      const updatedAuthor = await this.authorRepository.updateAuthor(
        id,
        existingAuthor,
      );

      logger.info("Author updated successfully", "AuthorService", {
        authorId: id,
      });

      return updatedAuthor;
    } catch (error) {
      logger.error("Failed to update author", "AuthorService", {
        authorId: id,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }

  async deleteAuthor(id) {
    try {
      const existingAuthor = await this.authorRepository.getAuthorById(id);

      if (!existingAuthor) {
        logger.warn("Author not found for deletion", "AuthorService", {
          authorId: id,
        });

        throw new AuthorNotFoundException(id);
      }

      const result = await this.authorRepository.deleteAuthor(id);

      logger.info("Author deleted successfully", "AuthorService", {
        authorId: id,
      });

      return result;
    } catch (error) {
      logger.error("Failed to delete author", "AuthorService", {
        authorId: id,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }
}

module.exports = AuthorService;
