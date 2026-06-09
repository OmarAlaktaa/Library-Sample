const logger = require("../../Infrastructure/Logging/logger");

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  async register(req, res, next) {
    // returns UserDTO of the newly created user,
    // otherwise throws an error if email is already in use
    try {
      const { name, email, password, role } = req.body;
      const user = await this.authService.register(name, email, password, role);
      res.status(201).json({ message: "User registered successfully", user });
      logger.info(`User ${name} registered successfully`, "AuthController", {
        userId: user.id,
      });
    } catch (error) {
      logger.error("Failed to register user", "AuthController", {
        error: error.message,
      });
      if (error.message === "Email is already in use") {
        res.status(400).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }

  async login(req, res, next) {
    // returns object with { user: UserDTO, token: JWT } if successful,
    //  otherwise throws InvalidCredentialsException
    try {
      const { email, password } = req.body;
      const data = await this.authService.login(email, password);
      res.status(200).json(data);
      logger.info("User logged in successfully", "AuthController", {
        userId: data.user.id,
      });
    } catch (error) {
      logger.error("Failed to login user", "AuthController", {
        error: error.message,
      });
      if (error.name === "InvalidCredentialsException") {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }
}

module.exports = AuthController;
