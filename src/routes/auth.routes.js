const express = require("express");

const authController = require("../controllers/auth.controller");
const { authRateLimiter } = require("../middleware/rate-limit.middleware");
const validate = require("../middleware/validate.middleware");
const { loginSchema, registerSchema } = require("../validations/auth.schema");

const router = express.Router();

router.use(authRateLimiter);

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
