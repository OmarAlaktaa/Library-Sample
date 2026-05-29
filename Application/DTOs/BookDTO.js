class BookDTO {
  /**
   * Parses and sanitizes incoming request data.
   * This prevents "Mass Assignment" vulnerabilities by ensuring only
   * expected fields are extracted from the req.body and converted to the correct types.
   * Any extra malicious or unwanted fields are simply ignored.
   */
  static fromRequest(body) {
    return {
      title: body.title ? String(body.title) : undefined,
      author: body.author ? String(body.author) : undefined,
      price: body.price !== undefined ? parseFloat(body.price) : undefined,
      ISBN: body.ISBN ? String(body.ISBN) : undefined,
    };
  }

  /**
   * Formats the entity for the client response.
   * This hides internal database fields (like hidden flags, timestamps, etc.)
   * and provides a stable API contract (if the Entity changes, the client API doesn't break).
   */
  static toResponse(book) {
    if (!book) return null;
    return {
      id: book.id,
      title: book.title, // Send only selected fields out
      author: book.author,
      price: book.price,
      ISBN: book.ISBN,
    };
  }
}

module.exports = BookDTO;
