const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  // Check Authorization Header

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract Token

      token = req.headers.authorization.split(" ")[1];

      // Verify Token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Save user id

      req.user = decoded.id;

      // Continue

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No Token",
    });
  }
};

module.exports = protect;
