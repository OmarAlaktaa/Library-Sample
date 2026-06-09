class UserNotFoundException extends Error {
  constructor(message = "User not found") {
    super(message);
    this.name = "UserNotFoundException";
    this.status = 404;
  }
}

module.exports = UserNotFoundException;