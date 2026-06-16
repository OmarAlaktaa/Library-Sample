const User = require("../../Domain/Entities/User");
const UserDTO = require("../DTOs/UserDTO");
const InvalidCredentialsException = require("../../Domain/Exceptions/Auth/InvalidCredentialsException");
const EmailAlreadyUsedException = require("../../Domain/Exceptions/Auth/EmailAlreadyUsedException");

class AuthService {
  constructor(
    userRepository,
    refreshTokenRepository,
    passwordHasher,
    tokenService,
    logger,
    refreshTokenTtlMs = 7 * 24 * 60 * 60 * 1000,
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
    this.logger = logger;
    this.refreshTokenTtlMs = refreshTokenTtlMs;
  }

  async register(name, email, password, role = "READER") {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      this.logger.warn("Email already used", "AuthService", { email });
      throw new EmailAlreadyUsedException();
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    const user = new User(null, name, email, hashedPassword, role);
    const savedUser = await this.userRepository.save(user);

    this.logger.info("User registered", "AuthService", {
      userId: savedUser.id,
    });

    return new UserDTO(savedUser);
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      this.logger.warn("Login failed (user not found)", "AuthService", {
        email,
      });
      throw new InvalidCredentialsException();
    }

    const valid = await this.passwordHasher.compare(password, user.password);

    if (!valid) {
      this.logger.warn("Login failed (bad password)", "AuthService", { email });
      throw new InvalidCredentialsException();
    }

    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);

    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: new UserDTO(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken) {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);

    const existing =
      await this.refreshTokenRepository.findByTokenHash(refreshToken);

    if (!existing) {
      throw new InvalidCredentialsException();
    }

    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const newAccessToken = this.tokenService.generateAccessToken(user);
    const newRefreshToken = this.tokenService.generateRefreshToken(user);

    await this.rotateRefreshToken(existing, newRefreshToken, user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async storeRefreshToken(userId, refreshToken) {
    await this.refreshTokenRepository.save({
      userId,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + this.refreshTokenTtlMs),
    });
  }

  async rotateRefreshToken(oldTokenRecord, newRefreshToken, userId) {
    await this.refreshTokenRepository.delete(oldTokenRecord.id);

    await this.refreshTokenRepository.save({
      userId,
      tokenHash: newRefreshToken,
      expiresAt: new Date(Date.now() + this.refreshTokenTtlMs),
    });
  }
}

module.exports = AuthService;
