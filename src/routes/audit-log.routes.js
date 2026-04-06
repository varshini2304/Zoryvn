const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const auditLogController = require("../controllers/audit-log.controller");
const validate = require("../middleware/validate.middleware");
const { getAuditLogsSchema } = require("../validations/audit-log.schema");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles(ROLES.ADMIN));

router.get("/", validate(getAuditLogsSchema), auditLogController.getAuditLogs);

module.exports = router;
