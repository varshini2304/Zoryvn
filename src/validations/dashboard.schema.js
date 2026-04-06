const { z, emptyObjectSchema } = require("./common.schema");

const dateRangeQueryShape = {
  startDate: z.coerce.date({ errorMap: () => ({ message: "Invalid startDate" }) }).optional(),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Invalid endDate" }) }).optional(),
  userId: z.string().uuid().optional()
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

const dateRangeQuerySchema = withDateRangeValidation(z.object(dateRangeQueryShape));

const summarySchema = z.object({
  body: emptyObjectSchema,
  params: emptyObjectSchema,
  query: dateRangeQuerySchema
});

const categoriesSchema = summarySchema;

const trendsSchema = z.object({
  body: emptyObjectSchema,
  params: emptyObjectSchema,
  query: withDateRangeValidation(
    z.object({
      ...dateRangeQueryShape,
      period: z.enum(["daily", "weekly", "monthly"]).optional()
    })
  )
});

const recentSchema = z.object({
  body: emptyObjectSchema,
  params: emptyObjectSchema,
  query: withDateRangeValidation(
    z.object({
      ...dateRangeQueryShape,
      limit: z.coerce.number().int().min(1, "limit must be at least 1").max(10, "limit must be 10 or less").optional()
    })
  )
});

module.exports = {
  summarySchema,
  categoriesSchema,
  trendsSchema,
  recentSchema
};
