const express = require('express');
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/expressError.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found!'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render('error.ejs', { message, hideHeaderFooter: true });
    // res.status(statusCode).send(message);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});