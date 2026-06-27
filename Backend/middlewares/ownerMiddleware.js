const Listing = require('../models/listingModel');
const User = require('../models/userModel');

const owner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const user = await User.findOne({
            firebaseUid: req.firebaseUser.uid
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin' || listing.ownerId.toString() === user._id.toString()) {
            return next();
        }

        return res.status(403).json({ message: 'Access denied. Owners only.' });
    } catch (error) {
        console.error("Error in owner middleware:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { owner };