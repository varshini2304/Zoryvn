const { QueryTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { RECORD_TYPES } = require("../utils/constants");

class DashboardRepository {
  async getSummary(scope) {
    const replacements = {};
    const whereClause = this.buildScopedWhereClause(scope, replacements);

    return sequelize.query(
      `
        SELECT
          COALESCE(SUM(CASE WHEN type = :incomeType THEN amount ELSE 0 END), 0) AS "totalIncome",
          COALESCE(SUM(CASE WHEN type = :expenseType THEN amount ELSE 0 END), 0) AS "totalExpense"
        FROM financial_records
        ${whereClause}
      `,
      {
        replacements: {
          ...replacements,
          incomeType: RECORD_TYPES.INCOME,
          expenseType: RECORD_TYPES.EXPENSE
        },
        type: QueryTypes.SELECT
      }
    );
  }

  async getCategoryBreakdown(scope) {
    const replacements = {};
    const whereClause = this.buildScopedWhereClause(scope, replacements);

    return sequelize.query(
      `
        SELECT
          category,
          type,
          COALESCE(SUM(amount), 0) AS total
        FROM financial_records
        ${whereClause}
        GROUP BY category, type
        ORDER BY category ASC, type ASC
      `,
      {
        replacements,
        type: QueryTypes.SELECT
      }
    );
  }

  async getTrends(scope, period) {
    const replacements = {
      period
    };
    const whereClause = this.buildScopedWhereClause(scope, replacements);

    return sequelize.query(
      `
        SELECT
          DATE_TRUNC(:period, date) AS bucket,
          type,
          COALESCE(SUM(amount), 0) AS total
        FROM financial_records
        ${whereClause}
        GROUP BY bucket, type
        ORDER BY bucket ASC, type ASC
      `,
      {
        replacements,
        type: QueryTypes.SELECT
      }
    );
  }

  async getRecentActivity(scope, limit) {
    const replacements = {
      limit
    };
    const whereClause = this.buildScopedWhereClause(scope, replacements);

    return sequelize.query(
      `
        SELECT
          id,
          user_id AS "userId",
          amount,
          type,
          category,
          date,
          notes,
          is_deleted AS "isDeleted",
          created_at AS "createdAt"
        FROM financial_records
        ${whereClause}
        ORDER BY date DESC, created_at DESC
        LIMIT :limit
      `,
      {
        replacements,
        type: QueryTypes.SELECT
      }
    );
  }

  buildScopedWhereClause(scope, replacements) {
    const conditions = ["is_deleted = false"];

    if (scope.userId) {
      conditions.push("user_id = :userId");
      replacements.userId = scope.userId;
    }

    if (scope.startDate) {
      conditions.push("date >= :startDate");
      replacements.startDate = scope.startDate;
    }

    if (scope.endDate) {
      conditions.push("date <= :endDate");
      replacements.endDate = scope.endDate;
    }

    return `WHERE ${conditions.join(" AND ")}`;
  }
}

module.exports = new DashboardRepository();
