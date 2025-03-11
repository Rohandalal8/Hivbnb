const express = require('express');
const app = express();
const methodOverride = require('method-override');
const listing = require('./models/listing');
const ejsMate = require('ejs-mate');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Index Route
app.get('/listings', async (req, res) => {
    const allListings = await listing.find({});
    res.render('listings/index.ejs', { allListings });
});

// New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Show Route 
app.get('/listing/:id', async (req, res) => {   
    const { id } = req.params;
    const Listing = await listing.findById(id);
    res.render('listings/show.ejs', { Listing });
});   

// Create Route
app.post('/listings', async (req, res) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
});

// Edit Route
app.get('/listing/:id/edit', async(req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id);
    res.render('listings/edit.ejs', { Listing });
});

// Update Route
app.put('/listings/:id', async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listing/${id}`);
});

// Delete Route
app.delete('/listing/:id', async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});