const jsonwebtoken = require('jsonwebtoken');


exports.authenticateUser = (req, res, next) => {
  
    try {
        const authHeader = req.headers.authorization;
        // console.log(authHeader)

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'User not authenticated', message: 'Invalid token format.' });
        }

        const token = authHeader.split(' ')[1];
 
        
        if (!token) {
            return res.status(401).json({ error: 'User not authenticated', message: 'Token not provided.' });
        }

        const decoded = jsonwebtoken.verify(token, "farmghar");

        req.user = decoded;
        next()
    } catch (error) {
        console.error('Authentication error :', error.message);
        return res.status(401).json({ error: 'User not authenticated', message: 'Invalid token.' });
    }
};


exports.checkUserRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user && req.user.userRole;

        if (Array.isArray(roles) && roles.includes(userRole)) {
            next();
        } else if (typeof roles === 'string' && roles === userRole) {
            next();
        } else {
            res.status(403).json({
                message: 'Permission denied',
            });
        }
    };
};



