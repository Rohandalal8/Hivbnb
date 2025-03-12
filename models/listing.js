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
            default: 'defaultimage'
        },
        url: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            set: (v) =>
                v === ""
                    ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    : v,
        },
    },
    price: Number,
    location: String,
    country: String
});

module.exports = mongoose.model('Listing', listingSchema);