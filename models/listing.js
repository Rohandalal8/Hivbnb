const mongoose = require('mongoose');
const review = require('./review.js');

// const MONGO_URL = 'mongodb://127.0.0.1:27017/Hivbnb';
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log('Error connecting to MongoDB: ', err);
    });

async function main() {
    await mongoose.connect(dbUrl);
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
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing.reviews.length) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model('Listing', listingSchema);