const express = require("express");

const authRoutes = require("./auth.routes");
const dashboardRoutes = require("./dashboard.routes");
const financialRecordRoutes = require("./financial-record.routes");
const userRoutes = require("./user.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/records", financialRecordRoutes);
router.use("/users", userRoutes);

module.exports = router;
