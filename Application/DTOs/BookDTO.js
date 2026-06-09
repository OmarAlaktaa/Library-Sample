class BookDTO {
  static fromRequest(body) {
    return {
      title: body.title ? String(body.title) : undefined,
      author: body.author ? String(body.author) : undefined,
      price: body.price !== undefined ? parseFloat(body.price) : undefined,
      ISBN: body.ISBN ? String(body.ISBN) : undefined,
    };
  }

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
