const mongoose = require('mongoose');

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
        filename: {
            type: String,
            default: 'listingimage'
        },
        url: {
            type: String,
            default: 'https://via.placeholder.com/150',
            set: (v) => v === '' ? 'https://via.placeholder.com/150' : v
        }
    },
    price: Number,
    location: String,
    country: String
});

module.exports = mongoose.model('Listing', listingSchema);