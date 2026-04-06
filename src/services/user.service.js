const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const env = require("../config/env");
const userRepository = require("../repositories/user.repository");
const cacheService = require("./cache.service");
const ApiError = require("../utils/api-error");
const { ROLES } = require("../utils/constants");
const {
  isNonEmptyString,
  isValidEmail,
  isValidRole
} = require("../utils/validators");

class UserService {
  async register(payload) {
    const { name, email, password } = payload;

    if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(password)) {
      throw new ApiError(400, "Invalid registration input");
    }

    const existingUser = await userRepository.findByEmail(email.toLowerCase());

    if (existingUser) {
      throw new ApiError(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userRepository.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: ROLES.VIEWER
    });

    return this.buildAuthResponse(user);
  }

  async login(payload) {
    const { email, password } = payload;

    if (!isValidEmail(email) || !isNonEmptyString(password)) {
      throw new ApiError(400, "Invalid login input");
    }

    const user = await userRepository.findByEmail(email.toLowerCase());

    if (!user || !user.isActive) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    return this.buildAuthResponse(user);
  }

  async logout(token) {
    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      const jti = decoded.jti;

      if (!jti) {
        return; // Old token without jti — nothing to blacklist
      }

      const now = Math.floor(Date.now() / 1000);
      const remainingTtl = decoded.exp - now;

      if (remainingTtl > 0) {
        await cacheService.setWithTtl(`blacklist:${jti}`, remainingTtl);
      }
    } catch {
      // If token is already expired or invalid, nothing to do
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Current password is incorrect");
    }

    if (oldPassword === newPassword) {
      throw new ApiError(400, "New password must differ from current password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
  }

  async getUsers() {
    return userRepository.findAll();
  }

  async updateUserRole(id, role) {
    if (!isValidRole(role)) {
      throw new ApiError(400, "Invalid role");
    }

    const user = await userRepository.updateRole(id, role);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return this.sanitizeUser(user);
  }

  async updateUserStatus(id, isActive) {
    if (typeof isActive !== "boolean") {
      throw new ApiError(400, "Invalid status");
    }

    const user = await userRepository.updateStatus(id, isActive);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return this.sanitizeUser(user);
  }

  buildAuthResponse(user) {
    const jti = crypto.randomUUID();
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        jti
      },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  sanitizeUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
  }
}

module.exports = new UserService();
