const financialRecordRepository = require("../repositories/financial-record.repository");
const auditLogService = require("./audit-log.service");
const cacheService = require("./cache.service");
const ApiError = require("../utils/api-error");
const { ROLES } = require("../utils/constants");
const {
  isNonEmptyString,
  isPositiveNumber,
  isValidDateValue,
  isValidRecordType
} = require("../utils/validators");

class FinancialRecordService {
  async createRecord(user, payload) {
    this.ensureWriteAccess(user);

    const validatedPayload = this.validateCreateOrUpdatePayload(payload);
    const record = await financialRecordRepository.create({
      userId: user.sub,
      createdBy: user.sub,
      updatedBy: user.sub,
      ...validatedPayload
    });

    await auditLogService.logRecordEvent({
      userId: user.sub,
      action: "CREATE",
      entityId: record.id
    });
    await this.invalidateDashboardSummaryCache();

    return this.sanitizeRecord(record);
  }

  async getRecords(user, query) {
    const page = this.parsePositiveInteger(query.page, 1);
    const limit = Math.min(this.parsePositiveInteger(query.limit, 10), 100);
    const offset = (page - 1) * limit;
    const filters = this.validateFilters(query);
    const where = financialRecordRepository.buildFilters({
      ...filters,
      userId: user.role === ROLES.ADMIN ? undefined : user.sub
    });
    const order = this.buildSort(query.sortBy, query.sortOrder);

    const { count, rows } = await financialRecordRepository.findAndCountAll({
      where,
      limit,
      offset,
      order
    });

    return {
      data: rows.map((record) => this.sanitizeRecord(record)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async updateRecord(user, recordId, payload) {
    this.ensureWriteAccess(user);

    const record = await this.getOwnedOrAdminRecord(user, recordId);
    const validatedPayload = this.validateCreateOrUpdatePayload(payload);
    const updatedRecord = await financialRecordRepository.update(record, {
      ...validatedPayload,
      updatedBy: user.sub
    });

    await auditLogService.logRecordEvent({
      userId: user.sub,
      action: "UPDATE",
      entityId: updatedRecord.id
    });
    await this.invalidateDashboardSummaryCache();

    return this.sanitizeRecord(updatedRecord);
  }

  async deleteRecord(user, recordId) {
    this.ensureWriteAccess(user);

    const record = await this.getOwnedOrAdminRecord(user, recordId);
    record.updatedBy = user.sub;
    await financialRecordRepository.softDelete(record);

    await auditLogService.logRecordEvent({
      userId: user.sub,
      action: "DELETE",
      entityId: record.id
    });
    await this.invalidateDashboardSummaryCache();
  }

  async restoreRecord(user, recordId) {
    this.ensureWriteAccess(user);

    const record = await this.getOwnedOrAdminRecord(user, recordId, true);
    record.updatedBy = user.sub;
    const restoredRecord = await financialRecordRepository.restore(record);

    await auditLogService.logRecordEvent({
      userId: user.sub,
      action: "UPDATE",
      entityId: restoredRecord.id
    });
    await this.invalidateDashboardSummaryCache();

    return this.sanitizeRecord(restoredRecord);
  }

  async getOwnedOrAdminRecord(user, recordId, includeDeleted = false) {
    const record = await financialRecordRepository.findById(recordId, includeDeleted);

    if (!record) {
      throw new ApiError(404, "Record not found");
    }

    if (user.role !== ROLES.ADMIN && record.userId !== user.sub) {
      throw new ApiError(403, "Not authorized to access this record");
    }

    return record;
  }

  ensureWriteAccess(user) {
    if (user.role === ROLES.VIEWER) {
      throw new ApiError(403, "Not authorized to modify records");
    }
  }

  validateCreateOrUpdatePayload(payload) {
    const { amount, type, category, date, notes } = payload;

    if (!isPositiveNumber(amount)) {
      throw new ApiError(400, "Amount must be a positive number");
    }

    if (!isValidRecordType(type)) {
      throw new ApiError(400, "Type must be INCOME or EXPENSE");
    }

    if (!isNonEmptyString(category)) {
      throw new ApiError(400, "Category is required");
    }

    if (!isValidDateValue(date)) {
      throw new ApiError(400, "Invalid date");
    }

    if (notes !== undefined && notes !== null && typeof notes !== "string") {
      throw new ApiError(400, "Notes must be a string");
    }

    return {
      amount,
      type,
      category: category.trim(),
      date: new Date(date),
      notes: isNonEmptyString(notes) ? notes.trim() : null
    };
  }

  validateFilters(query) {
    const filters = {};

    if (query.type) {
      if (!isValidRecordType(query.type)) {
        throw new ApiError(400, "Invalid type filter");
      }

      filters.type = query.type;
    }

    if (query.category) {
      filters.category = query.category;
    }

    if (query.search && !isNonEmptyString(query.search)) {
      throw new ApiError(400, "Invalid search value");
    }

    if (query.search) {
      filters.search = query.search.trim();
    }

    if (query.startDate) {
      if (!isValidDateValue(query.startDate)) {
        throw new ApiError(400, "Invalid startDate");
      }

      filters.startDate = new Date(query.startDate);
    }

    if (query.endDate) {
      if (!isValidDateValue(query.endDate)) {
        throw new ApiError(400, "Invalid endDate");
      }

      filters.endDate = new Date(query.endDate);
    }

    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
      throw new ApiError(400, "startDate cannot be greater than endDate");
    }

    return filters;
  }

  buildSort(sortBy = "date", sortOrder = "DESC") {
    const allowedSortFields = ["date", "amount"];
    const normalizedSortOrder = String(sortOrder).toUpperCase();

    if (!allowedSortFields.includes(sortBy)) {
      throw new ApiError(400, "Invalid sortBy value");
    }

    if (!["ASC", "DESC"].includes(normalizedSortOrder)) {
      throw new ApiError(400, "Invalid sortOrder value");
    }

    return [[sortBy, normalizedSortOrder]];
  }

  parsePositiveInteger(value, defaultValue) {
    if (value === undefined) {
      return defaultValue;
    }

    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
      throw new ApiError(400, "Pagination values must be positive integers");
    }

    return parsedValue;
  }

  sanitizeRecord(record) {
    return {
      id: record.id,
      userId: record.userId,
      createdBy: record.createdBy,
      updatedBy: record.updatedBy,
      amount: Number(record.amount),
      type: record.type,
      category: record.category,
      date: record.date,
      notes: record.notes,
      isDeleted: record.isDeleted,
      createdAt: record.createdAt
    };
  }

  async invalidateDashboardSummaryCache() {
    await cacheService.deleteByPrefix("dashboard_summary_user_");
  }
}

module.exports = new FinancialRecordService();
