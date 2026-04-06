const budgetRepository = require("../repositories/budget.repository");
const dashboardService = require("./dashboard.service");
const ApiError = require("../utils/api-error");

class BudgetService {
  async getBudgets(user) {
    const defaultQuery = {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59).toISOString()
    };
    
    // Use dashboard service to parallel fetch actual breakdown
    const [budgets, categoriesResult] = await Promise.all([
      budgetRepository.findAllByUser(user.sub),
      dashboardService.getCategoryBreakdown(user, defaultQuery).catch(() => [])
    ]);

    // Map spend to budgets
    const categorySpendMap = new Map();
    categoriesResult.forEach(c => {
      categorySpendMap.set(c.category, c.expense);
    });

    return budgets.map(b => {
      const amountUsed = categorySpendMap.get(b.category) || 0;
      const limit = Number(b.monthlyLimit);
      return {
        id: b.id,
        category: b.category,
        monthlyLimit: limit,
        amountUsed,
        isOverspent: amountUsed > limit
      };
    });
  }

  async createBudget(user, payload) {
    try {
      const budget = await budgetRepository.create({
        userId: user.sub,
        category: payload.category.trim(),
        monthlyLimit: payload.monthlyLimit
      });
      return budget;
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        throw new ApiError(400, "A budget already exists for this category");
      }
      throw err;
    }
  }

  async updateBudget(user, id, payload) {
    const budget = await budgetRepository.findById(id);
    this.ensureOwnership(budget, user);

    try {
      return await budgetRepository.update(budget, {
        monthlyLimit: payload.monthlyLimit
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteBudget(user, id) {
    const budget = await budgetRepository.findById(id);
    this.ensureOwnership(budget, user);
    await budgetRepository.delete(budget);
  }

  ensureOwnership(budget, user) {
    if (!budget) {
      throw new ApiError(404, "Budget not found");
    }
    if (budget.userId !== user.sub) {
      throw new ApiError(403, "Not authorized to modify this budget");
    }
  }
}

module.exports = new BudgetService();
