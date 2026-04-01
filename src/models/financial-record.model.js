const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { RECORD_TYPES } = require("../utils/constants");

const FinancialRecord = sequelize.define(
  "FinancialRecord",
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
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "created_by"
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "updated_by"
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    type: {
      type: DataTypes.ENUM(...Object.values(RECORD_TYPES)),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_deleted"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at"
    }
  },
  {
    tableName: "financial_records",
    timestamps: false,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["date"] },
      { fields: ["type"] },
      { fields: ["category"] },
      { fields: ["notes"] },
      { fields: ["is_deleted"] }
    ]
  }
);

module.exports = FinancialRecord;
