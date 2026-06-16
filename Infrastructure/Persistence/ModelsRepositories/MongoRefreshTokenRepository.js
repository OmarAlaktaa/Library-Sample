const RefreshTokenModel = require("../Models/RefreshTokenModel");

class MongoRefreshTokenRepository {
  constructor(logger) {
    this.logger = logger;
  }

  async save(tokenData) {
    return RefreshTokenModel.create(tokenData);
  }

  async findByTokenHash(tokenHash) {
    return RefreshTokenModel.findOne({
      tokenHash,
      revoked: false,
    });
  }

  async revokeByHash(tokenHash) {
    return RefreshTokenModel.updateOne({ tokenHash }, { revoked: true });
  }

  async revokeAllByUser(userId) {
    return RefreshTokenModel.updateMany({ userId }, { revoked: true });
  }

  async save({ userId, tokenHash, expiresAt }) {
    const refreshToken = new RefreshTokenModel({
      userId: userId,
      tokenHash: tokenHash,
      revoked: false,
      expiresAt: expiresAt,
    });
    const result = await refreshToken.save();

    // returns the result of the insert operation,
    // which includes information about the inserted document
    return result;
  }
}

module.exports = MongoRefreshTokenRepository;
