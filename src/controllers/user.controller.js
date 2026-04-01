const userService = require("../services/user.service");

const getUsers = async (_req, res, next) => {
  try {
    const users = await userService.getUsers();

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    return next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const user = await userService.updateUserStatus(req.params.id, req.body.isActive);

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  updateUserStatus
};
