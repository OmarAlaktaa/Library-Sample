class BookNotFoundException extends Error {
  constructor(id) {
    super(`Book with ID ${id} was not found.`);
    this.name = "BookNotFoundException";
    this.statusCode = 404; // Attach status code so the controller knows how to respond
  }
}

module.exports = BookNotFoundException;
