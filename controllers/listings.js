const listing = require('../models/listing');
const moment = require('moment');

module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render('listings/index.ejs', { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');
    if (!Listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { Listing, moment });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash('success', `Your new listing "${newListing.title}" has been created. Start attracting guests now!`);
    res.redirect('/listings');
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { Listing });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, req.body.listing);
    req.flash('success', `Your listing has been updated successfully!`);
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', `Your listing has been deleted successfully!`);
    res.redirect('/listings');
} 