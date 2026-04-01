const { z, emptyObjectSchema, uuidParamSchema } = require("./common.schema");
const { ROLES } = require("../utils/constants");

const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(ROLES, {
      errorMap: () => ({ message: "Invalid role" })
    })
  }).strict(),
  params: uuidParamSchema,
  query: emptyObjectSchema
});

const updateUserStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean()
  }).strict(),
  params: uuidParamSchema,
  query: emptyObjectSchema
});

module.exports = {
  updateUserRoleSchema,
  updateUserStatusSchema
};
