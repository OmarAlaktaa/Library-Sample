const userRepository = require("../../Infrastructure/Persistence/ModelsRepositories/MongoUserRepository");
const passwordHasher = require("../../Infrastructure/Security/PasswordHasher");
const tokenService = require("../../Infrastructure/Security/TokenService");
const User = require("../../Domain/Entities/User");
const UserDTO = require("../DTOs/UserDTO");
const InvalidCredentialsException = require("../../Domain/Exceptions/Auth/InvalidCredentialsException");

class AuthService {
  constructor(userRepository, passwordHasher, tokenService, logger) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
    this.logger = logger;
  }

  async register(name, email, password, role = "READER") {
    // returns UserDTO of the newly created user,
    // otherwise throws an error if email is already in use
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      this.logger.warn("Attempt to register existing user", "AuthService", {
        email,
      });
      throw new Error("Email is already in use");
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const userToSave = new User(null, name, email, hashedPassword, role);
    const savedUser = await this.userRepository.save(userToSave);

    this.logger.info("New user registered successfully", "AuthService", {
      userId: savedUser.id,
      email: savedUser.email,
    });
    return new UserDTO(savedUser);
  }

  async login(email, password) {
    // returns object with { user: UserDTO, token: JWT } if successful,
    //  otherwise throws InvalidCredentialsException
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.warn(
        "Failed login attempt with non-existent email",
        "AuthService",
        {
          email,
        },
      );
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      this.logger.warn(
        "Failed login attempt with invalid password",
        "AuthService",
        {
          email,
        },
      );
      throw new InvalidCredentialsException();
    }

    const token = this.tokenService.generateToken(user);
    this.logger.info("User logged in successfully", "AuthService", {
      userId: user.id,
      email: user.email,
    });
    return {
      user: new UserDTO(user),
      token,
    };
  }
}

module.exports = AuthService;
