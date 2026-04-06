const { z, uuidParamSchema, emptyObjectSchema } = require("./common.schema");

const createBudgetSchema = z.object({
  body: z.object({
    category: z.string().trim().min(1, "Category is required").max(100, "Category is too long"),
    monthlyLimit: z.coerce.number().positive("Limit must be positive")
  }).strict(),
  params: emptyObjectSchema,
  query: emptyObjectSchema
});

const updateBudgetSchema = z.object({
  body: z.object({
    monthlyLimit: z.coerce.number().positive("Limit must be positive")
  }).strict(),
  params: uuidParamSchema,
  query: emptyObjectSchema
});

const budgetIdSchema = z.object({
  body: emptyObjectSchema,
  params: uuidParamSchema,
  query: emptyObjectSchema
});

module.exports = {
  createBudgetSchema,
  updateBudgetSchema,
  budgetIdSchema
};
