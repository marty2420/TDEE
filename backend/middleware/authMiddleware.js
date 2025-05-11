  // middleware/authMiddleware.js
  const jwt = require('jsonwebtoken');

  // Middleware to authenticate JWT token
  const authenticateToken = (req, res, next) => {
    // Get token from Authorization header (format: 'Bearer <token>')
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
      // Verify the token using the JWT secret from environment variable
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user data (like userId) to the request object
      req.user = decoded; // This will be available in subsequent route handlers

      next();  // Proceed to the next middleware or route handler
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };

  module.exports = authenticateToken;
