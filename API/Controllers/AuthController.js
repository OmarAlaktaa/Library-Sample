const authService = require("../../Application/Services/AuthService");

class AuthController {
  async register(req, res, next) {
    // returns UserDTO of the newly created user,
    // otherwise throws an error if email is already in use
    try {
      const { name, email, password, role } = req.body;
      const user = await authService.register(name, email, password, role);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
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
      const data = await authService.login(email, password);
      res.status(200).json(data);
    } catch (error) {
      if (error.name === "InvalidCredentialsException") {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }
}

module.exports = new AuthController();
