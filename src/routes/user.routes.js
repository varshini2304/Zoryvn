const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const userController = require("../controllers/user.controller");
const { ROLES } = require("../utils/constants");
const {
  updateUserRoleSchema,
  updateUserStatusSchema
} = require("../validations/user.schema");

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles(ROLES.ADMIN));

router.get("/", userController.getUsers);
router.patch("/:id/role", validate(updateUserRoleSchema), userController.updateUserRole);
router.patch("/:id/status", validate(updateUserStatusSchema), userController.updateUserStatus);

module.exports = router;
