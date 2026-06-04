const TokenService = require("./TokenService");

class AuthMiddleware {
  verifyToken(req, res, next) {
    const AUTH_SCHEME = "Bearer ";

    if (!authHeader?.startsWith(AUTH_SCHEME)) {
      return res.status(401).json({
        message: "Access Denied: No token provided",
      });
    }

    const token = authHeader.slice(AUTH_SCHEME.length);

    try {
      const decodedUser = TokenService.verifyToken(token);
      req.user = decodedUser; // Injecting user payload to request
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  verifyAdmin(req, res, next) {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Access Denied: Not authenticated" });
    }
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Access Denied: Requires Admin Privileges" });
    }
    next();
  }
}

module.exports = new AuthMiddleware();
