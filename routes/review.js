const express = require('express');
const router = express.Router({ mergeParams: true });
const listing = require('../models/listing.js');
const review = require('../models/review.js');
const ExpressError = require('../utils/expressError.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { reviewSchema } = require('../schema.js');

const reviewListing = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// post review route
router.post('/', reviewListing, wrapAsync(async (req, res) => {
    const Listing = await listing.findById(req.params.id);
    const Review = new review(req.body.review);
    Listing.reviews.push(Review);
    await Review.save();
    await Listing.save();
    res.redirect(`/listings/${Listing._id}`);
}));

// delete review route 
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;