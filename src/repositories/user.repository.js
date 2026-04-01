const User = require("../models/user.model");

class UserRepository {
  create(payload) {
    return User.create(payload);
  }

  findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  findById(id) {
    return User.findByPk(id);
  }

  findAll() {
    return User.findAll({
      attributes: {
        exclude: ["password"]
      },
      order: [["createdAt", "DESC"]]
    });
  }

  async updateRole(id, role) {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    user.role = role;
    await user.save();

    return user;
  }

  async updateStatus(id, isActive) {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    user.isActive = isActive;
    await user.save();

    return user;
  }
}

module.exports = new UserRepository();
