const Budget = require("../models/budget.model");

class BudgetRepository {
  create(payload) {
    return Budget.create(payload);
  }

  findAllByUser(userId) {
    return Budget.findAll({
      where: { userId },
      order: [["category", "ASC"]]
    });
  }

  findById(id) {
    return Budget.findByPk(id);
  }

  async update(budget, payload) {
    Object.assign(budget, payload);
    await budget.save();
    return budget;
  }

  async delete(budget) {
    await budget.destroy();
  }
}

module.exports = new BudgetRepository();
