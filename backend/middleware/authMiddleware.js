const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // Enable n8n or other automations via static API Key
    const automationKey = req.headers['x-automation-key'];
    if (automationKey && automationKey === process.env.AUTOMATION_API_KEY) {
        req.user = { id: 'automation-user', role: 'Admin' };
        return next();
    }

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
