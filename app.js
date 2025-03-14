const express = require('express');
const app = express();
const methodOverride = require('method-override');
const listing = require('./models/listing');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/expressError.js');
const { listingSchema } = require('./schema.js');
const review = require('./models/review');
const { reviewSchema } = require('./schema.js');
const moment = require('moment');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const reviewListing = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Index Route
app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await listing.find({});
    res.render('listings/index.ejs', { allListings });
}));

// New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Show Route 
app.get('/listing/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id).populate('reviews');
    res.render('listings/show.ejs', { Listing, moment });
}));

// Create Route
app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}));

// Edit Route
app.get('/listing/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id);
    res.render('listings/edit.ejs', { Listing });
}));

// Update Route
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listing/${id}`);
}));

// Delete Route
app.delete('/listing/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// Review 
// post route
app.post('/listings/:id/reviews', reviewListing, wrapAsync(async (req, res) => {
    const Listing = await listing.findById(req.params.id);
    const Review = new review(req.body.review);
    Listing.reviews.push(Review);
    await Review.save();
    await Listing.save();
    res.redirect(`/listing/${Listing._id}`);
}));

// app.get('/testListing', async (req, res) => {
//     const sampleListing = new listing({
//         title: 'Sample Listing',
//         description: 'This is a sample listing',
//         price: 100,
//         location: 'Toronto',
//         country: 'Canada'
//     });

//     await sampleListing.save();
//     res.send(sampleListing);
// });

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found!'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render('error.ejs', { message });
    // res.status(statusCode).send(message);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});