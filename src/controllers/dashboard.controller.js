const dashboardService = require("../services/dashboard.service");

const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary(req.user, req.query);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryBreakdown(req.user, req.query);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const data = await dashboardService.getTrends(req.user, req.query);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

const getRecent = async (req, res, next) => {
  try {
    const data = await dashboardService.getRecentActivity(req.user, req.query);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSummary,
  getCategories,
  getTrends,
  getRecent
};
