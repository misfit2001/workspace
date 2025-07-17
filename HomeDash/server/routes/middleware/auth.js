const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const requireUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth: No valid authorization header found');
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      console.log('Auth: No token provided');
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Auth: Decoded token:', decoded);

    // Find the user - check both userId and sub fields for compatibility
    const userId = decoded.userId || decoded.sub;
    console.log('Auth: Looking for user with ID:', userId);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log('Auth: User not found for ID:', userId);
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Add user info to request
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    console.log(`Auth: User ${user.email} authenticated successfully`);
    next();
  } catch (error) {
    console.error('Auth: Token verification failed:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

module.exports = {
  requireUser
};