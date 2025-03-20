const mongooose = require('mongoose');

const reviewSchema = new mongooose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongooose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongooose.model('Review', reviewSchema);