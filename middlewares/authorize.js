/**
 * Middleware function to authorize users based on their role.
 * Grants access only if the user's role matches one of the allowed roles.
 * @param {...number} allowedRoles - The roles that are permitted to access the route.
 * @returns {Function} - Express middleware function.
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.user;

        // Check if the user's role is among the allowed roles
        if (!allowedRoles.includes(role)) {
            // Deny access if the role is not permitted
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }

        // If authorized, proceed to the next middleware or route handler
        next(); 
    };
};

module.exports = authorize;
