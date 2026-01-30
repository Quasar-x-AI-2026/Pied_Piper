const UserService = require('../services/user-service');

const userService = new UserService();

async function authMiddleware (req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        
        
        if (!authHeader) {
            console.log('No Authorization header');
            return res.status(401).json({ error: 'No Authorization header provided' });
        }
        
        const parts = authHeader.split(' ');

        const token = parts[1];
        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({ error: 'No valid token provided' });
        }
        
        const userId = await userService.isAuthenticated(token);
        req.user = { id: userId };
        next();
    } catch (error) {
        console.log('Auth middleware error:', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }   
}

module.exports = authMiddleware;
