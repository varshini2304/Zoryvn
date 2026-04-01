const { z, emptyObjectSchema } = require("./common.schema");

const authBodyBase = {
  email: z.string().trim().email("Valid email is required").transform((value) => value.toLowerCase()),
  password: z.string().trim().min(8, "Password must be at least 8 characters")
};

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name is required").max(100, "Name is too long"),
    ...authBodyBase
  }).strict(),
  params: emptyObjectSchema,
  query: emptyObjectSchema
});

const loginSchema = z.object({
  body: z.object(authBodyBase).strict(),
  params: emptyObjectSchema,
  query: emptyObjectSchema
});

module.exports = {
  registerSchema,
  loginSchema
};
