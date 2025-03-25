const listing = require('./models/listing');
const review = require('./models/review');
const ExpressError = require('./utils/expressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const axios = require('axios');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to access this page!');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing.owner.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const Review = await review.findById(reviewId);
    if (!Review.author.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.reviewListing = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.getCoordinates = async (location) => {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`;
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'YourAppName' } // Required by Nominatim
        });

        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return [parseFloat(lat), parseFloat(lon)];
        } else {
            return { error: `No results found for ${location}` };
        }
    } catch (error) {
        return { error: error.message };
    }
}