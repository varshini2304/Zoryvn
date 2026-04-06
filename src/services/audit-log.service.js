const auditLogRepository = require("../repositories/audit-log.repository");
const logger = require("../utils/logger");
const { ROLES } = require("../utils/constants");

class AuditLogService {
  async logRecordEvent({ userId, action, entityId, metadata }) {
    await auditLogRepository.create({
      userId,
      action,
      entity: "RECORD",
      entityId,
      metadata
    });

    logger.info("Financial record audit event", {
      userId,
      action,
      entity: "RECORD",
      entityId,
      metadata
    });
  }

  async getAuditLogs(user, query) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const offset = (page - 1) * limit;

    const filters = {
      action: query.action,
      entity: query.entity,
      startDate: query.startDate,
      endDate: query.endDate,
      userId: user.role === ROLES.ADMIN ? query.userId : user.sub
    };

    const where = auditLogRepository.buildFilters(filters);

    const { count, rows } = await auditLogRepository.findAndCountAll({
      where,
      limit,
      offset
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
}

module.exports = new AuditLogService();
