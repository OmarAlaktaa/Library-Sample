class InvalidISBNException extends Error {
  constructor() {
    super("Invalid ISBN: ISBN cannot be empty");
    this.name = "InvalidISBNException";
    this.statusCode = 400; // Attach status code for controller response, 400 Bad Request
  }
}

module.exports = InvalidISBNException;
