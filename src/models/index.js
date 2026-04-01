const User = require("./user.model");
const FinancialRecord = require("./financial-record.model");

User.hasMany(FinancialRecord, {
  foreignKey: "userId",
  as: "financialRecords"
});

FinancialRecord.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

module.exports = {
  User,
  FinancialRecord
};
