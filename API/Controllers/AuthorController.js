const AuthorDTO = require("../../Application/DTOs/AuthorDTO");
const logger = require("../../Infrastructure/Logging/logger");

class AuthorController {
  constructor(authorService) {
    this.authorService = authorService;
  }

  /**
   * @desc Get all authors
   */
  getAllAuthors = async (req, res) => {
    try {
      const authors = await this.authorService.getAllAuthors();

      const responseData = authors.map((author) =>
        AuthorDTO.toResponse(author),
      );

      logger.info("All authors retrieved successfully", "AuthorController", {
        count: authors.length,
      });

      return res.status(200).json(responseData);
    } catch (error) {
      logger.error("Failed to retrieve authors", "AuthorController", {
        message: error.message,
        stack: error.stack,
      });

      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  };

  /**
   * @desc Get an author by ID
   */
  getAuthorById = async (req, res) => {
    try {
      const authorId = parseInt(req.params.id, 10);

      if (isNaN(authorId)) {
        logger.warn("Invalid author ID format", "AuthorController", {
          param: req.params.id,
        });

        return res.status(400).json({
          error: "Invalid author ID",
        });
      }

      const author = await this.authorService.getAuthorById(authorId);

      if (!author) {
        logger.warn("Author not found", "AuthorController", {
          authorId,
        });

        return res.status(404).json({
          error: "Author not found",
        });
      }

      const responseData = AuthorDTO.toResponse(author);

      logger.info("Author retrieved successfully", "AuthorController", {
        authorId: author.id,
      });

      logger.info(
        `Author with Id${authorId} retrieved successfully`,
        "AuthorController",
      );

      return res.status(200).json(responseData);
    } catch (error) {
      logger.error("Failed to retrieve author", "AuthorController", {
        message: error.message,
        stack: error.stack,
        authorId: req.params.id,
      });
      logger.error(
        `Failed to retrieve author with Id${req.params.id}`,
        "AuthorController",
      );
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  };

  /**
   * @desc Add a new author
   */
  addAuthor = async (req, res) => {
    try {
      const safeData = AuthorDTO.fromRequest(req.body);

      const newAuthor = await this.authorService.addAuthor(safeData);

      const responseData = AuthorDTO.toResponse(newAuthor);

      logger.info("Author created successfully", "AuthorController", {
        authorId: newAuthor.id,
      });

      return res.status(201).json(responseData);
    } catch (error) {
      logger.error("Failed to create author", "AuthorController", {
        message: error.message,
        stack: error.stack,
        body: req.body,
      });

      return res.status(500).json({
        error: "Failed to create author",
      });
    }
  };

  /**
   * @desc Update an author
   */
  updateAuthor = async (req, res) => {
    try {
      const authorId = parseInt(req.params.id, 10);

      if (isNaN(authorId)) {
        logger.warn("Invalid author ID format", "AuthorController", {
          param: req.params.id,
          authorId,
        });

        return res.status(400).json({
          error: "Invalid author ID",
        });
      }

      const safeData = AuthorDTO.fromRequest(req.body);

      const updatedAuthor = await this.authorService.updateAuthor(
        authorId,
        safeData,
      );

      if (!updatedAuthor) {
        logger.warn(
          `Author with Id=${authorId} not found for update`,
          "AuthorController",
          {
            authorId,
          },
        );

        return res.status(404).json({
          error: "Author not found",
        });
      }

      const responseData = AuthorDTO.toResponse(updatedAuthor);

      logger.info(
        `Author with Id${authorId} updated successfully`,
        "AuthorController",
        {
          authorId,
        },
      );

      return res.status(200).json(responseData);
    } catch (error) {
      logger.error(
        `Failed to update author with Id=${req.params.id}`,
        "AuthorController",
        {
          message: error.message,
          stack: error.stack,
          authorId: req.params.id,
          body: req.body,
        },
      );

      return res.status(500).json({
        error: "Failed to update author",
      });
    }
  };

  /**
   * @desc Delete an author
   */
  deleteAuthor = async (req, res) => {
    try {
      const authorId = parseInt(req.params.id, 10);

      if (isNaN(authorId)) {
        logger.warn("Invalid author ID format", "AuthorController", {
          param: req.params.id,
        });

        return res.status(400).json({
          error: "Invalid author ID",
        });
      }

      const deleted = await this.authorService.deleteAuthor(authorId);

      if (!deleted) {
        logger.warn("Author not found for deletion", "AuthorController", {
          authorId,
        });

        return res.status(404).json({
          error: "Author not found",
        });
      }
    } catch (error) {
      logger.error(
        `Failed to delete author with Id=${req.params.id}`,
        "AuthorController",
        {
          message: error.message,
          stack: error.stack,
          authorId: req.params.id,
        },
      );

      return res.status(500).json({
        error: "Failed to delete author",
      });
    }
  };
}

module.exports = AuthorController;
