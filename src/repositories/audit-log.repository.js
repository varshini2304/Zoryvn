const { Op } = require("sequelize");
const AuditLog = require("../models/audit-log.model");

class AuditLogRepository {
  create(payload) {
    return AuditLog.create(payload);
  }

  findAndCountAll({ where, limit, offset }) {
    return AuditLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [["timestamp", "DESC"]]
    });
  }

  buildFilters(filters) {
    const where = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.entity) where.entity = filters.entity;

    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) where.timestamp[Op.gte] = filters.startDate;
      if (filters.endDate) where.timestamp[Op.lte] = filters.endDate;
    }
    return where;
  }
}

module.exports = new AuditLogRepository();
