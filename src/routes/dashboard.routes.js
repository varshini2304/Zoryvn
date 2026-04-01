const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const dashboardController = require("../controllers/dashboard.controller");
const validate = require("../middleware/validate.middleware");
const { ROLES } = require("../utils/constants");
const {
  summarySchema,
  categoriesSchema,
  trendsSchema,
  recentSchema
} = require("../validations/dashboard.schema");

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles(ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER));

router.get("/summary", validate(summarySchema), dashboardController.getSummary);
router.get("/categories", validate(categoriesSchema), dashboardController.getCategories);
router.get("/trends", validate(trendsSchema), dashboardController.getTrends);
router.get("/recent", validate(recentSchema), dashboardController.getRecent);

module.exports = router;
