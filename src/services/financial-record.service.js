const financialRecordRepository = require("../repositories/financial-record.repository");
const auditLogService = require("./audit-log.service");
const cacheService = require("./cache.service");
const ApiError = require("../utils/api-error");
const fastCsv = require("fast-csv");
const { ROLES } = require("../utils/constants");

class FinancialRecordService {
  async createRecord(user, payload) {
    this.ensureWriteAccess(user);

    const record = await financialRecordRepository.create({
      userId: user.sub,
      createdBy: user.sub,
      updatedBy: user.sub,
      ...payload
    });

    await auditLogService.logRecordEvent({
      userId: user.sub,
      action: "CREATE",
      entityId: record.id,
      metadata: { after: this.sanitizeRecord(record) }
    });
    await this.invalidateDashboardSummaryCache();

    return this.sanitizeRecord(record);
  }

  async getRecords(user, query) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    
    // We can rely on query being valid because of the Zod schema
    const where = financialRecordRepository.buildFilters({
      ...query,
      userId: user.role === ROLES.ADMIN ? undefined : user.sub
    });
    
    const sortBy = query.sortBy || "date";
    const sortOrder = query.sortOrder ? query.sortOrder.toUpperCase() : "DESC";
    const order = [[sortBy, sortOrder]];

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

  async exportRecords(user, query, responseStream) {
    const where = financialRecordRepository.buildFilters({
      ...query,
      userId: user.role === ROLES.ADMIN ? undefined : user.sub
    });

    const csvStream = fastCsv.format({ headers: true });
    csvStream.pipe(responseStream);

    let offset = 0;
    const limit = 1000;
    let hasMore = true;

    while (hasMore) {
      const { rows } = await financialRecordRepository.findAndCountAll({
        where,
        limit,
        offset,
        order: [["date", "DESC"]]
      });

      if (rows.length === 0) {
        hasMore = false;
        break;
      }

      for (const record of rows) {
        csvStream.write(this.sanitizeRecord(record));
      }

      offset += limit;
    }

    csvStream.end();
  }

  async importRecords(user, fileBuffer) {
    this.ensureWriteAccess(user);

    return new Promise((resolve, reject) => {
      const recordsToInsert = [];
      const errors = [];
      let rowNumber = 1;

      fastCsv
        .parseString(fileBuffer.toString(), { headers: true, skipEmptyLines: true })
        .on("data", (row) => {
          rowNumber++;
          try {
            recordsToInsert.push({
              userId: user.sub,
              createdBy: user.sub,
              updatedBy: user.sub,
              amount: Number(row.amount),
              type: row.type,
              category: row.category,
              date: new Date(row.date),
              notes: row.notes || null,
            });
          } catch (err) {
            errors.push(`Row ${rowNumber}: Invalid data format`);
          }
        })
        .on("end", async () => {
          if (recordsToInsert.length > 0) {
            try {
              await financialRecordRepository.createBulk(recordsToInsert);
              await auditLogService.logRecordEvent({
                userId: user.sub,
                action: "CREATE",
                entityId: "BULK_IMPORT",
                metadata: { importedCount: recordsToInsert.length }
              });
              await this.invalidateDashboardSummaryCache();
            } catch (err) {
              reject(new ApiError(500, "Database error during bulk insert"));
              return;
            }
          }
          resolve({ inserted: recordsToInsert.length, errors });
        })
        .on("error", () => {
          reject(new ApiError(400, "Failed to parse CSV file"));
        });
    });
  }

  async updateRecord(user, recordId, payload) {
    this.ensureWriteAccess(user);

    const record = await this.getOwnedOrAdminRecord(user, recordId);
    const oldRecordData = this.sanitizeRecord(record);
    const updatedRecord = await financialRecordRepository.update(record, {
      ...payload,
      updatedBy: user.sub
    });

    await auditLogService.logRecordEvent({
      userId: user.sub,
      action: "UPDATE",
      entityId: updatedRecord.id,
      metadata: { before: oldRecordData, after: this.sanitizeRecord(updatedRecord) }
    });
    await this.invalidateDashboardSummaryCache();

    return this.sanitizeRecord(updatedRecord);
  }

  async deleteRecord(user, recordId) {
    this.ensureWriteAccess(user);

    const record = await this.getOwnedOrAdminRecord(user, recordId);
    record.updatedBy = user.sub;
    const oldRecordData = this.sanitizeRecord(record);
    await financialRecordRepository.softDelete(record);

    await auditLogService.logRecordEvent({
      userId: user.sub,
      action: "DELETE",
      entityId: record.id,
      metadata: { before: oldRecordData }
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
      entityId: restoredRecord.id,
      metadata: { action: "RESTORED", after: this.sanitizeRecord(restoredRecord) }
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
    await cacheService.deleteByPrefix("dashboard_categories_user_");
    await cacheService.deleteByPrefix("dashboard_trends_");
  }
}

module.exports = new FinancialRecordService();
