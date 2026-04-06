const auditLogService = require("../services/audit-log.service");

const getAuditLogs = async (req, res, next) => {
  try {
    const result = await auditLogService.getAuditLogs(req.user, req.query);

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAuditLogs
};
