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

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get financial records
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, amount]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authorizeRoles(ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER),
  validate(getFinancialRecordsSchema),
  financialRecordController.getRecords
);
/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinancialRecordRequest'
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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
