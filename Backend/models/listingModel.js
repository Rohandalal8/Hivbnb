const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    imageUrls: [{
        type: String,
        required: true
    }],
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    numReviews: {
        type: Number,
        default: 0
    },
    avgRating: {
        type: Number,
        default: 0
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Listing', listingSchema);