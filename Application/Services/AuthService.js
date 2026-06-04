const userRepository = require("../../Infrastructure/Persistence/MongoUserRepository");
const passwordHasher = require("../../Infrastructure/Security/PasswordHasher");
const tokenService = require("../../Infrastructure/Security/TokenService");
const User = require("../../Domain/Entities/User");
const UserDTO = require("../DTOs/UserDTO");
const InvalidCredentialsException = require("../../Domain/Exceptions/InvalidCredentialsException");

class AuthService {
  async register(name, email, password, role = "READER") {
    // returns UserDTO of the newly created user,
    // otherwise throws an error if email is already in use
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const hashedPassword = await passwordHasher.hash(password);
    const userToSave = new User(null, name, email, hashedPassword, role);
    const savedUser = await userRepository.save(userToSave);

    return new UserDTO(savedUser);
  }

  async login(email, password) {
    // returns object with { user: UserDTO, token: JWT } if successful,
    //  otherwise throws InvalidCredentialsException
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await passwordHasher.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const token = tokenService.generateToken(user);
    return {
      user: new UserDTO(user),
      token,
    };
  }
}

module.exports = new AuthService();
