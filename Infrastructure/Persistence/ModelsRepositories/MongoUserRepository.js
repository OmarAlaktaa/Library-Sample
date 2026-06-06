const UserModel = require("../Models/UserModel");
const User = require("../../../Domain/Entities/User");

class MongoUserRepository {
  async save(userEntity) {
    // returns a User entity
    const userModel = new UserModel({
      name: userEntity.name,
      email: userEntity.email,
      password: userEntity.password,
      role: userEntity.role,
    });
    const savedUser = await userModel.save();
    return this._mapToEntity(savedUser);
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return this._mapToEntity(user);
  }

  async findById(id) {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return this._mapToEntity(user);
  }

  _mapToEntity(userModel) {
    return new User(
      userModel._id.toString(),
      userModel.name,
      userModel.email,
      userModel.password,
      userModel.role,
    );
  }
}

module.exports = new MongoUserRepository();
