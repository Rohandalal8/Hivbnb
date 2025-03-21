const listing = require('../models/listing.js');
const review = require('../models/review.js');

module.exports.createReview = async (req, res) => {
    const Listing = await listing.findById(req.params.id);
    const Review = new review(req.body.review);
    Review.author = req.user._id;
    Listing.reviews.push(Review);
    await Review.save();
    await Listing.save();
    req.flash('success', `Your review has been posted successfully`);
    res.redirect(`/listings/${Listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash('success', `Your review has been deleted successfully`);
    res.redirect(`/listings/${id}`);
}