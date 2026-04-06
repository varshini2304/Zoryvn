const cron = require("node-cron");
const { Op } = require("sequelize");
const FinancialRecord = require("../models/financial-record.model");
const financialRecordRepository = require("../repositories/financial-record.repository");
const auditLogService = require("../services/audit-log.service");

// Helper to add interval to a date
const getNextDate = (date, interval) => {
  const next = new Date(date);
  if (interval === "daily") {
    next.setDate(next.getDate() + 1);
  } else if (interval === "weekly") {
    next.setDate(next.getDate() + 7);
  } else if (interval === "monthly") {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
};

const processRecurringRecords = async () => {
  try {
    console.log("Running recurring records job...");
    
    // Find all recurring records whose next occurrence is today or earlier
    const recordsToProcess = await FinancialRecord.findAll({
      where: {
        isDeleted: false,
        isRecurring: true,
        nextRecurrenceDate: {
          [Op.lte]: new Date()
        }
      }
    });

    for (const record of recordsToProcess) {
      // 1. Create the new cloned record
      const clone = await financialRecordRepository.create({
        userId: record.userId,
        amount: record.amount,
        type: record.type,
        category: record.category,
        date: record.nextRecurrenceDate,
        notes: record.notes,
        createdBy: record.userId,
        updatedBy: record.userId,
        isRecurring: record.isRecurring,
        recurrenceInterval: record.recurrenceInterval,
        nextRecurrenceDate: getNextDate(record.nextRecurrenceDate, record.recurrenceInterval)
      });

      // 2. Clear recurring flag on the ORIGINAL record (it's no longer the active recurring template)
      record.isRecurring = false;
      record.nextRecurrenceDate = null;
      record.recurrenceInterval = null;
      await record.save();

      // 3. Log audit event
      await auditLogService.logRecordEvent({
        userId: record.userId,
        action: "CREATE",
        entityId: clone.id,
        metadata: { source: "RECURRING_JOB", parentId: record.id }
      });
    }

    console.log(`Recurring records job finished. Processed ${recordsToProcess.length} records.`);
  } catch (error) {
    console.error("Error processing recurring records:", error);
  }
};

// Run daily at midnight
const initRecurringJob = () => {
  cron.schedule("0 0 * * *", processRecurringRecords);
  console.log("Recurring records cron job initialized");
};

module.exports = {
  initRecurringJob,
  processRecurringRecords
};
