const Listing = require('../models/listingModel');

const owner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing) {
        return res.status(404).json({ message: 'Listing not found' });
    }

    if (user.role === 'admin' || listing.owner.equals(req.user._id)) {
        return next();
    }

    return res.status(403).json({ message: 'Access denied. Owners only.' });
};

module.exports = { owner };