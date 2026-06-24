const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { owner } = require('../middlewares/ownerMiddleware');
const { createListing, getListings, getListingById, updateListing, deleteListing, getWishlistListings, addListingReview } = require('../controllers/listingController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route('/').get(getListings).post(protect, upload.array('images', 20), createListing);
router.route('/:id').get(getListingById).put(protect, owner, upload.array('images', 20), updateListing).delete(protect, owner, deleteListing);
router.route('/wishlist').post(getWishlistListings);
router.route('/:id/reviews').post(protect, addListingReview);

module.exports = router;