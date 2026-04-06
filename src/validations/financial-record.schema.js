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
  notes: z.string().trim().max(1000, "Notes are too long").optional().nullable(),
  isRecurring: z.boolean().optional(),
  recurrenceInterval: z.enum(["daily", "weekly", "monthly"]).optional().nullable()
}).strict();

const paginationQueryShape = {
  page: z.coerce.number().int().positive("page must be a positive integer").optional(),
  limit: z.coerce.number().int().positive("limit must be a positive integer").max(100, "limit must be 100 or less").optional(),
  type: z.nativeEnum(RECORD_TYPES).optional(),
  category: z.string().trim().min(1).max(100).optional(),
  search: z.string().trim().min(1, "search must not be empty").max(100, "search is too long").optional(),
  startDate: z.coerce.date({ errorMap: () => ({ message: "Invalid startDate" }) }).optional(),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Invalid endDate" }) }).optional(),
  sortBy: z.enum(["date", "amount", "category", "createdAt"]).optional(),
  sortOrder: z.enum(["ASC", "DESC", "asc", "desc"]).optional()
};

const withDateRangeValidation = (schema) =>
  schema.superRefine((value, ctx) => {
    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "startDate cannot be greater than endDate",
        path: ["startDate"]
      });
    }
  });

const paginationQuerySchema = withDateRangeValidation(z.object(paginationQueryShape));

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

const exportFinancialRecordsSchema = z.object({
  body: emptyObjectSchema,
  params: emptyObjectSchema,
  query: withDateRangeValidation(
    z.object({
      type: paginationQueryShape.type,
      category: paginationQueryShape.category,
      startDate: paginationQueryShape.startDate,
      endDate: paginationQueryShape.endDate
    })
  )
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
  exportFinancialRecordsSchema,
  financialRecordIdSchema
};
