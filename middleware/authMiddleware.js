const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_for_development';

/**
 * Auth Middleware
 * Checks for a Bearer JWT token in the Authorization header,
 * verifies it, and attaches the decoded payload to req.user.
 * Returns 401 if the token is missing or invalid.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Expect format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attaches { userId, iat, exp } to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = authMiddleware;
