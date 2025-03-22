const mongoose = require('mongoose');
const review = require('./review.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/Hivbnb';

main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log('Error connecting to MongoDB: ', err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing.reviews.length) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model('Listing', listingSchema);