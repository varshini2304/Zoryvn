const budgetService = require("../services/budget.service");

const getBudgets = async (req, res, next) => {
  try {
    const result = await budgetService.getBudgets(req.user);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

const createBudget = async (req, res, next) => {
  try {
    const result = await budgetService.createBudget(req.user, req.body);

    return res.status(201).json({
      success: true,
      message: "Budget created successfully",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const result = await budgetService.updateBudget(req.user, req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    await budgetService.deleteBudget(req.user, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully"
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};
