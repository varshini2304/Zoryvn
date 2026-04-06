const User = require("./user.model");
const FinancialRecord = require("./financial-record.model");
const AuditLog = require("./audit-log.model");
const Budget = require("./budget.model");

User.hasMany(FinancialRecord, {
  foreignKey: "userId",
  as: "financialRecords"
});

FinancialRecord.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

User.hasMany(AuditLog, {
  foreignKey: "userId",
  as: "auditLogs"
});

AuditLog.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

User.hasMany(Budget, {
  foreignKey: "userId",
  as: "budgets"
});

Budget.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

module.exports = {
  User,
  FinancialRecord,
  AuditLog,
  Budget
};
