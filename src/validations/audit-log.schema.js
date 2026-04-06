const { z, emptyObjectSchema } = require("./common.schema");

const getAuditLogsSchema = z.object({
  body: emptyObjectSchema,
  params: emptyObjectSchema,
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    userId: z.string().uuid().optional(),
    action: z.enum(["CREATE", "UPDATE", "DELETE"]).optional(),
    entity: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
  }).superRefine((value, ctx) => {
    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "startDate cannot be greater than endDate",
        path: ["startDate"]
      });
    }
  })
});

module.exports = {
  getAuditLogsSchema
};
