const { Op } = require("sequelize");
const FinancialRecord = require("../models/financial-record.model");

class FinancialRecordRepository {
  create(payload) {
    return FinancialRecord.create(payload);
  }

  createBulk(payloads) {
    return FinancialRecord.bulkCreate(payloads);
  }

  findById(id, includeDeleted = false) {
    return FinancialRecord.findOne({
      where: {
        id,
        ...(includeDeleted ? {} : { isDeleted: false })
      }
    });
  }

  findAndCountAll({ where, limit, offset, order }) {
    return FinancialRecord.findAndCountAll({
      where: {
        ...where,
        isDeleted: false
      },
      limit,
      offset,
      order
    });
  }

  async update(record, payload) {
    Object.assign(record, payload);
    await record.save();
    return record;
  }

  async softDelete(record) {
    record.isDeleted = true;
    await record.save();
    return record;
  }

  async restore(record) {
    record.isDeleted = false;
    await record.save();
    return record;
  }

  buildFilters(filters) {
    const where = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where[Op.or] = [
        {
          category: {
            [Op.iLike]: `%${filters.search}%`
          }
        },
        {
          notes: {
            [Op.iLike]: `%${filters.search}%`
          }
        }
      ];
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};

      if (filters.startDate) {
        where.date[Op.gte] = filters.startDate;
      }

      if (filters.endDate) {
        where.date[Op.lte] = filters.endDate;
      }
    }

    return where;
  }
}

module.exports = new FinancialRecordRepository();
