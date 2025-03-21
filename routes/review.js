const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { reviewListing, isLoggedIn, isReviewAuthor } = require('../middleware.js');

const reviewController = require('../controllers/reviews.js');

// post review route
router.post('/', reviewListing, isLoggedIn, wrapAsync(reviewController.createReview));

// delete review route 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;