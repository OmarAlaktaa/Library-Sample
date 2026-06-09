class Book {
  constructor(id, title, author, price, ISBN) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.price = price;
    this.ISBN = ISBN;
  }

  validatePrice() {
    if (this.price < 0) {
      throw new InvalidBookPriceException();
    }
  }

  validateISBN() {
    if (!this.ISBN || this.ISBN.trim().length === 0) {
      throw new InvalidISBNException();
    }
  }

  validate() {
    this.validatePrice();
    this.validateISBN();
  }
}
module.exports = Book;
