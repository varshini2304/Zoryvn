const financialRecordService = require("../services/financial-record.service");
const { toCsv } = require("../utils/csv");

const createRecord = async (req, res, next) => {
  try {
    const record = await financialRecordService.createRecord(req.user, req.body);

    return res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: record
    });
  } catch (error) {
    return next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const result = await financialRecordService.getRecords(req.user, req.query);

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    return next(error);
  }
};

const exportRecords = async (req, res, next) => {
  try {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=\"records.csv\"");

    await financialRecordService.exportRecords(req.user, req.query, res);
  } catch (error) {
    if (!res.headersSent) {
      return next(error);
    }
    console.error("Error streaming CSV:", error);
    res.end();
  }
};

const importRecords = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "CSV file is required" });
    }

    const result = await financialRecordService.importRecords(req.user, req.file.buffer);

    return res.status(200).json({
      success: true,
      message: "Records imported successfully",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await financialRecordService.updateRecord(req.user, req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: record
    });
  } catch (error) {
    return next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    await financialRecordService.deleteRecord(req.user, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Record deleted successfully"
    });
  } catch (error) {
    return next(error);
  }
};

const restoreRecord = async (req, res, next) => {
  try {
    const record = await financialRecordService.restoreRecord(req.user, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Record restored successfully",
      data: record
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRecord,
  getRecords,
  exportRecords,
  importRecords,
  updateRecord,
  deleteRecord,
  restoreRecord
};
