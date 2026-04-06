const jwt = require("jsonwebtoken");
const env = require("../config/env");
const cacheService = require("../services/cache.service");
const ApiError = require("../utils/api-error");

const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    // Check JWT blacklist (for logged-out tokens)
    if (decoded.jti) {
      const isBlacklisted = await cacheService.exists(`blacklist:${decoded.jti}`);
      if (isBlacklisted) {
        return next(new ApiError(401, "Token has been revoked"));
      }
    }

    req.user = decoded;
    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

module.exports = authenticate;
