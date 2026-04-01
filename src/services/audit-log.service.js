const auditLogRepository = require("../repositories/audit-log.repository");
const logger = require("../utils/logger");

class AuditLogService {
  async logRecordEvent({ userId, action, entityId }) {
    await auditLogRepository.create({
      userId,
      action,
      entity: "RECORD",
      entityId
    });

    logger.info("Financial record audit event", {
      userId,
      action,
      entity: "RECORD",
      entityId
    });
  }
}

module.exports = new AuditLogService();
