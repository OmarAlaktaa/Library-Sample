const logger = require("../../Infrastructure/Logging/logger");

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async register(req, res, next) {
    // returns UserDTO of the newly created user,
    // otherwise throws an error if email is already in use

    const { name, email, password, role } = req.body;
    const user = await this.authService.register(name, email, password, role);
    if (user) {
      res.status(201).json({ message: "User registered successfully", user }); // 201 code means "Created"
    } else {
      res.status(400).json({ message: "Email is already in use" }); // 400 code means "Bad Request"
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    const data = await this.authService.login(email, password);

    res.status(200).json(data);
  }

  async refresh(req, res) {
    const { refreshToken } = req.body;

    const tokens = await this.authService.refresh(refreshToken);

    res.status(200).json(tokens);
  }
}

module.exports = AuthController;
