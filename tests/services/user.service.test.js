const userService = require("../../src/services/user.service");
const userRepository = require("../../src/repositories/user.repository");
const cacheService = require("../../src/services/cache.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../src/repositories/user.repository");
jest.mock("../../src/services/cache.service");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("crypto", () => ({
  randomUUID: () => "mock-uuid"
}));

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const mockUser = { id: 1, email: "test@test.com", password: "hashedPassword", isActive: true, role: "VIEWER" };
      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mock-token");

      const result = await userService.login({ email: "test@test.com", password: "password" });

      expect(result).toHaveProperty("token", "mock-token");
      expect(result.user).toHaveProperty("email", "test@test.com");
    });
  });

  describe("logout", () => {
    it("should blacklist token if jti exists and has remaining ttl", async () => {
      const decodedToken = { jti: "jti-1", exp: Math.floor(Date.now() / 1000) + 1000 };
      jwt.verify.mockReturnValue(decodedToken);

      await userService.logout("mock-token");

      expect(cacheService.setWithTtl).toHaveBeenCalledWith(
        "blacklist:jti-1",
        expect.any(Number)
      );
    });
  });
});
