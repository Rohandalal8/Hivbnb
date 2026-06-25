const User = require('../models/userModel');
const firebaseAdmin = require('../config/firebaseAdmin');

const protect = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Not authorized, no token' });
            }
            const token = authHeader.split(' ')[1];
            const decoded = await firebaseAdmin.auth.verifyIdToken(token);
            req.firebaseUser = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
};

module.exports = { protect };