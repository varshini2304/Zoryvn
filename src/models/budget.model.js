const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Budget = sequelize.define(
  "Budget",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id"
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    monthlyLimit: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "monthly_limit",
      validate: {
        min: 0.01
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at"
    }
  },
  {
    tableName: "budgets",
    timestamps: false,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["user_id", "category"], unique: true }
    ]
  }
);

module.exports = Budget;
