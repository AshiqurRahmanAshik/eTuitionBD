// Import JWT
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // Get token from request headers
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No token provided. Access denied." });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Invalid token format. Access denied." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request object
    req.user = decoded; // decoded contains: { userId, email, role }

    // Continue to next middleware or route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please login again." });
    }
    return res.status(403).json({ message: "Invalid token. Access denied." });
  }
};

module.exports = verifyToken;
