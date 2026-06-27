const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { owner } = require('../middlewares/ownerMiddleware');
const { createListing, getListings, getListingById, updateListing, deleteListing, getMyListings, toggleWishlist, getWishlist, addListingReview } = require('../controllers/listingController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route('/').get(getListings).post(protect, upload.array('images', 20), createListing);
router.route('/my-listings').get(protect, getMyListings);
router.route('/wishlist').put(protect, toggleWishlist).get(protect, getWishlist);
router.route('/:id').get(getListingById).put(protect, owner, upload.array('images', 20), updateListing).delete(protect, owner, deleteListing);
router.route('/:id/reviews').post(protect, addListingReview);

module.exports = router;