const jwt = require('jsonwebtoken');

/**
 * Middleware function to authenticate JWT tokens.
 * Protects routes by ensuring that requests have a valid JWT.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authenticate = (req, res, next) => {
    // Extract token from the Authorization header if it exists
    // OLD: const token = req.headers.authorization?.split(' ')[1];
    const token = req.cookies.authToken;

    // If no token is provided, respond with 401 Unauthorized
    if (!token) {
        return res.redirect('/login');
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach decoded user information to the request object
        req.user = decoded;
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If token verification fails, respond with 401 Unauthorized
        // res.status(401).json({ message: 'Invalid or expired token' });
        return res.redirect('/login');
    }
};

module.exports = authenticate;
