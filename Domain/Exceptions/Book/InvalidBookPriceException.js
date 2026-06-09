const { model } = require("mongoose");

class InvalidBookPriceException extends Error {
  constructor() {
    super("Invalid book price: Price cannot be negative");
    this.name = "InvalidBookPriceException";
    this.statusCode = 400; // Attach status code for controller response, 400 Bad Request
  }
}

module.exports = InvalidBookPriceException;
