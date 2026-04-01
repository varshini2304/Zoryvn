const financialRecordService = require("../services/financial-record.service");

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

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};
