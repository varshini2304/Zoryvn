const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const budgetController = require("../controllers/budget.controller");
const validate = require("../middleware/validate.middleware");
const { ROLES } = require("../utils/constants");
const {
  createBudgetSchema,
  updateBudgetSchema,
  budgetIdSchema
} = require("../validations/budget.schema");

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles(ROLES.ADMIN, ROLES.ANALYST));

router.get("/", budgetController.getBudgets);
router.post("/", validate(createBudgetSchema), budgetController.createBudget);
router.put("/:id", validate(updateBudgetSchema), budgetController.updateBudget);
router.delete("/:id", validate(budgetIdSchema), budgetController.deleteBudget);

module.exports = router;
