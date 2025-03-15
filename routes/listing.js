const express = require('express');
const router = express.Router();
const listing = require('../models/listing.js');
const ExpressError = require('../utils/expressError.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const moment = require('moment');

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
router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Show Route 
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id).populate('reviews');
    res.render('listings/show.ejs', { Listing, moment });
}));

// Create Route
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}));

// Edit Route
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id);
    res.render('listings/edit.ejs', { Listing });
}));

// Update Route
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

module.exports = router;