const AuthorDTO = require("../../Application/DTOs/AuthorDTO");

class AuthorController {
  constructor(authorService) {
    this.authorService = authorService;
  }

  /**
   * @desc Get all authors
   * @route GET /authors
   * @method GET
   * @access public
   */
  getAllAuthors = async (req, res) => {
    try {
      const authors = await this.authorService.getAllAuthors();
      
      // Use DTO to safely format an array of responses to the client (hiding internal fields)
      const responseData = authors.map((author) => AuthorDTO.toResponse(author));
      return res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  /**
   * @desc Get an author by ID
   * @route GET /authors/:id
   * @method GET
   * @access public
   */
  getAuthorById = async (req, res) => {
    try {
      const author = await this.authorService.getAuthorById(parseInt(req.params.id));
      if (!author) {
        return res.status(404).json({ error: "Author not found" });
      }
      
      // Map entity directly to a presentation DTO object so the API contract remains stable
      const responseData = AuthorDTO.toResponse(author);
      return res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  /**
   * @desc Add a new author
   * @route POST /authors
   * @method POST
   * @access public
   */
  addAuthor = async (req, res) => {
    try {
      // DTO filters and sanitizes user input preventing mass-assignment attacks
      const safeData = AuthorDTO.fromRequest(req.body);
      const newAuthor = await this.authorService.addAuthor(safeData);
      
      const responseData = AuthorDTO.toResponse(newAuthor);
      return res.status(201).json(responseData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create author" });
    }
  };

  /**
   * @desc Update an author
   * @route PUT /authors/:id
   * @method PUT
   * @access public
   */
  updateAuthor = async (req, res) => {
    try {
      // Filter out unwanted request metadata directly in the controller layer via the DTO
      const safeData = AuthorDTO.fromRequest(req.body);
      const updatedAuthor = await this.authorService.updateAuthor(
        parseInt(req.params.id),
        safeData
      );
      
      // Format the returned updated resource
      const responseData = AuthorDTO.toResponse(updatedAuthor);
      return res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update author" });
    }
  };

  /**
   * @desc Delete an author
   * @route DELETE /authors/:id
   * @method DELETE
   * @access public
   */
  deleteAuthor = async (req, res) => {
    try {
      await this.authorService.deleteAuthor(parseInt(req.params.id));
      return res.status(200).json({ message: "Author deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete author" });
    }
  };
}

module.exports = AuthorController;
