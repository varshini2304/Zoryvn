const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const financialRecordController = require("../controllers/financial-record.controller");
const validate = require("../middleware/validate.middleware");
const { ROLES } = require("../utils/constants");
const {
  createFinancialRecordSchema,
  updateFinancialRecordSchema,
  getFinancialRecordsSchema,
  financialRecordIdSchema
} = require("../validations/financial-record.schema");

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  authorizeRoles(ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER),
  validate(getFinancialRecordsSchema),
  financialRecordController.getRecords
);
router.post(
  "/",
  authorizeRoles(ROLES.ADMIN, ROLES.ANALYST),
  validate(createFinancialRecordSchema),
  financialRecordController.createRecord
);
router.put(
  "/:id",
  authorizeRoles(ROLES.ADMIN, ROLES.ANALYST),
  validate(updateFinancialRecordSchema),
  financialRecordController.updateRecord
);
router.delete(
  "/:id",
  authorizeRoles(ROLES.ADMIN, ROLES.ANALYST),
  validate(financialRecordIdSchema),
  financialRecordController.deleteRecord
);

module.exports = router;
