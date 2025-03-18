const express = require('express');
const router = express.Router();
const listing = require('../models/listing.js');
const ExpressError = require('../utils/expressError.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const moment = require('moment');
const { isLoggedIn } = require('../middleware.js');

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Index Route
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await listing.find({});
    res.render('listings/index.ejs', { allListings });
}));

// New Route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new.ejs');
});

// Show Route 
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id).populate('reviews');
    if (!Listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { Listing, moment });
}));

// Create Route
router.post('/', isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    req.flash('success', `Your new listing "${newListing.title}" has been created. Start attracting guests now!`);
    res.redirect('/listings');
}));

// Edit Route
router.get('/:id/edit',isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { Listing });
}));

// Update Route
router.put('/:id', isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, req.body.listing);
    req.flash('success', `Your listing has been updated successfully!`);
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', `Your listing has been deleted successfully!`);
    res.redirect('/listings');
}));

module.exports = router;