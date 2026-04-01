const AuditLog = require("../models/audit-log.model");

class AuditLogRepository {
  create(payload) {
    return AuditLog.create(payload);
  }
}

module.exports = new AuditLogRepository();
