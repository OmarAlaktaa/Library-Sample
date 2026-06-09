class InvalidCredentialsException extends Error {
  constructor(message = "Invalid email or password") {
    super(message);
    this.name = "InvalidCredentialsException";
    this.status = 401;
  }
}

module.exports = InvalidCredentialsException;
