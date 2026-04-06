const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AuditLog = sequelize.define(
  "AuditLog",
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
    action: {
      type: DataTypes.ENUM("CREATE", "UPDATE", "DELETE"),
      allowNull: false
    },
    entity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "entity_id"
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "audit_logs",
    timestamps: false,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["entity"] },
      { fields: ["entity_id"] }
    ]
  }
);

module.exports = AuditLog;
