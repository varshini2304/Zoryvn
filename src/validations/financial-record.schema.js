const { z, uuidParamSchema, emptyObjectSchema } = require("./common.schema");
const { RECORD_TYPES } = require("../utils/constants");

const financialRecordBodySchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  type: z.nativeEnum(RECORD_TYPES, {
    errorMap: () => ({ message: "Type must be INCOME or EXPENSE" })
  }),
  category: z.string().trim().min(1, "Category is required").max(100, "Category is too long"),
  date: z.coerce.date({
    errorMap: () => ({ message: "Invalid date" })
  }),
  notes: z.string().trim().max(1000, "Notes are too long").optional().nullable()
}).strict();

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive("page must be a positive integer").optional(),
  limit: z.coerce.number().int().positive("limit must be a positive integer").max(100, "limit must be 100 or less").optional(),
  type: z.nativeEnum(RECORD_TYPES).optional(),
  category: z.string().trim().min(1).max(100).optional(),
  startDate: z.coerce.date({ errorMap: () => ({ message: "Invalid startDate" }) }).optional(),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Invalid endDate" }) }).optional(),
  sortBy: z.enum(["date", "amount"]).optional(),
  sortOrder: z.enum(["ASC", "DESC", "asc", "desc"]).optional()
}).superRefine((value, ctx) => {
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "startDate cannot be greater than endDate",
      path: ["startDate"]
    });
  }
});

const createFinancialRecordSchema = z.object({
  body: financialRecordBodySchema,
  params: emptyObjectSchema,
  query: emptyObjectSchema
});

const updateFinancialRecordSchema = z.object({
  body: financialRecordBodySchema,
  params: uuidParamSchema,
  query: emptyObjectSchema
});

const getFinancialRecordsSchema = z.object({
  body: emptyObjectSchema,
  params: emptyObjectSchema,
  query: paginationQuerySchema
});

const financialRecordIdSchema = z.object({
  body: emptyObjectSchema,
  params: uuidParamSchema,
  query: emptyObjectSchema
});

module.exports = {
  createFinancialRecordSchema,
  updateFinancialRecordSchema,
  getFinancialRecordsSchema,
  financialRecordIdSchema
};
