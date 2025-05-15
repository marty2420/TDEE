
  const jwt = require('jsonwebtoken');


  const authenticateToken = (req, res, next) => {
   
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
     
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; 

      next();  
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };

  module.exports = authenticateToken;
