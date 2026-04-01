const { z, emptyObjectSchema } = require("./common.schema");

const dateRangeQuerySchema = z.object({
  startDate: z.coerce.date({ errorMap: () => ({ message: "Invalid startDate" }) }).optional(),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Invalid endDate" }) }).optional()
}).superRefine((value, ctx) => {
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "startDate cannot be greater than endDate",
      path: ["startDate"]
    });
  }
});

const summarySchema = z.object({
  body: emptyObjectSchema,
  params: emptyObjectSchema,
  query: dateRangeQuerySchema
});

const categoriesSchema = summarySchema;

const trendsSchema = z.object({
  body: emptyObjectSchema,
  params: emptyObjectSchema,
  query: dateRangeQuerySchema.extend({
    period: z.enum(["daily", "monthly"]).optional()
  })
});

const recentSchema = z.object({
  body: emptyObjectSchema,
  params: emptyObjectSchema,
  query: dateRangeQuerySchema.extend({
    limit: z.coerce.number().int().min(1, "limit must be at least 1").max(10, "limit must be 10 or less").optional()
  })
});

module.exports = {
  summarySchema,
  categoriesSchema,
  trendsSchema,
  recentSchema
};
