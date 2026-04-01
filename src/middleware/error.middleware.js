const { DatabaseError, UniqueConstraintError, ValidationError } = require("sequelize");
const { ZodError } = require("zod");
const logger = require("../utils/logger");

const formatValidationMessage = (details) => {
  if (!details) {
    return "Validation failed";
  }

  if (details instanceof ZodError) {
    return details.issues.map((issue) => issue.message).join(", ");
  }

  if (Array.isArray(details.errors)) {
    return details.errors.map((error) => error.message).join(", ");
  }

  return "Validation failed";
};

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.details instanceof ZodError) {
    statusCode = 400;
    message = formatValidationMessage(err.details);
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = formatValidationMessage(err);
  } else if (err instanceof UniqueConstraintError) {
    statusCode = 400;
    message = formatValidationMessage(err);
  } else if (err instanceof ValidationError) {
    statusCode = 400;
    message = formatValidationMessage(err);
  } else if (err instanceof DatabaseError) {
    statusCode = 500;
    message = "Database error";
  }

  logger.error(message, {
    path: req.originalUrl,
    method: req.method,
    statusCode
  });

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
