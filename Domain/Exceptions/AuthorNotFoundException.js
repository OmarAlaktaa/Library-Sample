class AuthorNotFoundException extends Error {
  constructor(id) {
    super(`Author with ID ${id} not found`);
    this.name = "AuthorNotFoundException";
    this.statusCode = 404; // Attach status code for controller response
  }
}
module.exports = AuthorNotFoundException;
