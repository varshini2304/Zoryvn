const express = require("express");

const authRoutes = require("./auth.routes");
const dashboardRoutes = require("./dashboard.routes");
const financialRecordRoutes = require("./financial-record.routes");
const userRoutes = require("./user.routes");
const auditLogRoutes = require("./audit-log.routes");
const budgetRoutes = require("./budget.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/records", financialRecordRoutes);
router.use("/users", userRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/budgets", budgetRoutes);

module.exports = router;
