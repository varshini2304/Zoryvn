const dashboardRepository = require("../repositories/dashboard.repository");
const cacheService = require("./cache.service");
const ApiError = require("../utils/api-error");
const { ROLES, RECORD_TYPES } = require("../utils/constants");
const { isValidDateValue } = require("../utils/validators");

class DashboardService {
  async getSummary(user, query) {
    const scope = this.buildScope(user, query);
    const cacheKey = this.buildSummaryCacheKey(user, scope);
    const cachedSummary = await cacheService.get(cacheKey);

    if (cachedSummary) {
      return cachedSummary;
    }

    const [summary] = await dashboardRepository.getSummary(scope);
    const totalIncome = Number(summary?.totalIncome || 0);
    const totalExpense = Number(summary?.totalExpense || 0);
    const result = {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    };

    await cacheService.set(cacheKey, result, 60);

    return result;
  }

  async getCategoryBreakdown(user, query) {
    const scope = this.buildScope(user, query);
    const cacheKey = this.buildSummaryCacheKey(user, scope).replace("dashboard_summary_", "dashboard_categories_");
    const cachedCategories = await cacheService.get(cacheKey);

    if (cachedCategories) {
      return cachedCategories;
    }

    const rows = await dashboardRepository.getCategoryBreakdown(scope);
    const categories = new Map();

    rows.forEach((row) => {
      const category = row.category;
      const existing = categories.get(category) || {
        category,
        income: 0,
        expense: 0,
        total: 0
      };
      const amount = Number(row.total || 0);

      if (row.type === RECORD_TYPES.INCOME) {
        existing.income = amount;
      }

      if (row.type === RECORD_TYPES.EXPENSE) {
        existing.expense = amount;
      }

      existing.total = existing.income - existing.expense;
      categories.set(category, existing);
    });

    const result = Array.from(categories.values());
    await cacheService.set(cacheKey, result, 60);

    return result;
  }

  async getTrends(user, query) {
    const scope = this.buildScope(user, query);
    const period = this.validateTrendPeriod(query.period);
    
    const cacheKey = this.buildSummaryCacheKey(user, scope).replace("dashboard_summary_", `dashboard_trends_${period}_`);
    const cachedTrends = await cacheService.get(cacheKey);

    if (cachedTrends) {
      return cachedTrends;
    }

    const rows = await dashboardRepository.getTrends(scope, period);
    const trends = new Map();

    rows.forEach((row) => {
      const key = new Date(row.bucket).toISOString();
      const existing = trends.get(key) || {
        period: row.bucket,
        income: 0,
        expense: 0,
        net: 0
      };
      const amount = Number(row.total || 0);

      if (row.type === RECORD_TYPES.INCOME) {
        existing.income = amount;
      }

      if (row.type === RECORD_TYPES.EXPENSE) {
        existing.expense = amount;
      }

      existing.net = existing.income - existing.expense;
      trends.set(key, existing);
    });

    const result = Array.from(trends.values());
    await cacheService.set(cacheKey, result, 60);

    return result;
  }

  async getRecentActivity(user, query) {
    const scope = this.buildScope(user, query);
    const limit = this.parseRecentLimit(query.limit);
    const rows = await dashboardRepository.getRecentActivity(scope, limit);

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      amount: Number(row.amount),
      type: row.type,
      category: row.category,
      date: row.date,
      notes: row.notes,
      isDeleted: row.isDeleted,
      createdAt: row.createdAt
    }));
  }

  buildScope(user, query) {
    const scope = {};

    if (user.role !== ROLES.ADMIN) {
      scope.userId = user.sub;
    } else if (query.userId) {
      scope.userId = query.userId;
    }

    if (query.startDate) {
      if (!isValidDateValue(query.startDate)) {
        throw new ApiError(400, "Invalid startDate");
      }

      scope.startDate = new Date(query.startDate);
    }

    if (query.endDate) {
      if (!isValidDateValue(query.endDate)) {
        throw new ApiError(400, "Invalid endDate");
      }

      scope.endDate = new Date(query.endDate);
    }

    if (scope.startDate && scope.endDate && scope.startDate > scope.endDate) {
      throw new ApiError(400, "startDate cannot be greater than endDate");
    }

    return scope;
  }

  validateTrendPeriod(period = "daily") {
    const normalizedPeriod = String(period).toLowerCase();

    if (normalizedPeriod === "daily") {
      return "day";
    }

    if (normalizedPeriod === "weekly") {
      return "week";
    }

    if (normalizedPeriod === "monthly") {
      return "month";
    }

    throw new ApiError(400, "period must be daily, weekly, or monthly");
  }

  parseRecentLimit(limit) {
    if (limit === undefined) {
      return 5;
    }

    const parsedLimit = Number(limit);

    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 10) {
      throw new ApiError(400, "limit must be an integer between 1 and 10");
    }

    return parsedLimit;
  }

  buildSummaryCacheKey(user, scope) {
    const userKey = user.role === ROLES.ADMIN ? "all" : user.sub;

    return [
      `dashboard_summary_user_${userKey}`,
      `role_${user.role}`,
      `start_${scope.startDate ? scope.startDate.toISOString() : "none"}`,
      `end_${scope.endDate ? scope.endDate.toISOString() : "none"}`
    ].join("_");
  }
}

module.exports = new DashboardService();
