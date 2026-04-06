const jwt = require("jsonwebtoken");
const authenticate = require("../../src/middleware/auth.middleware");
const cacheService = require("../../src/services/cache.service");
const env = require("../../src/config/env");
const ApiError = require("../../src/utils/api-error");

jest.mock("jsonwebtoken");
jest.mock("../../src/services/cache.service");
jest.mock("../../src/config/env", () => ({
  jwtSecret: "test-secret"
}));

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should fail if no authorization header is provided", async () => {
    await authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it("should fail if invalid token format", async () => {
    req.headers.authorization = "Basic something";
    await authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });

  it("should pass valid token with no blacklist hit", async () => {
    req.headers.authorization = "Bearer valid_token";
    const decoded = { sub: "user_1", role: "VIEWER", jti: "some_jti" };
    jwt.verify.mockReturnValue(decoded);
    cacheService.exists.mockResolvedValue(false);

    await authenticate(req, res, next);

    expect(cacheService.exists).toHaveBeenCalledWith("blacklist:some_jti");
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalledWith(); // success, no args
  });

  it("should fail if token jti is in blacklist", async () => {
    req.headers.authorization = "Bearer valid_token";
    const decoded = { sub: "user_1", role: "VIEWER", jti: "some_jti" };
    jwt.verify.mockReturnValue(decoded);
    cacheService.exists.mockResolvedValue(true);

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].message).toBe("Token has been revoked");
  });
});
