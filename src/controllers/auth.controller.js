const userService = require("../services/user.service");

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login
};
