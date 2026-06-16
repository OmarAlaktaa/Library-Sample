class EmailAlreadyUsedException extends Error {
  constructor(message = "Email is already in use") {
    super(message);
    this.name = "EmailAlreadyUsedException";
    this.status = 409; // HTTP status code for Conflict
  }
}

module.exports = EmailAlreadyUsedException;
