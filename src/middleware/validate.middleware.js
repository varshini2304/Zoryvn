const ApiError = require("../utils/api-error");

const validate = (schema) => {
  return async (req, _res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query
      });

      req.body = parsed.body;
      req.params = parsed.params;
      req.query = parsed.query;

      return next();
    } catch (error) {
      return next(new ApiError(400, "Validation failed", error));
    }
  };
};

module.exports = validate;
