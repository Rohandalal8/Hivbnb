const User = require('../models/userModel');
const firebaseAdmin = require('../config/firebaseAdmin');

const admin = async (req, res, next) => {
    const admin = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (admin && admin.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

module.exports = { admin };