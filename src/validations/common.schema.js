const { z } = require("zod");

const emptyObjectSchema = z.object({}).strict();
const uuidParamSchema = z.object({
  id: z.string().uuid("Invalid resource id")
});

module.exports = {
  z,
  emptyObjectSchema,
  uuidParamSchema
};
