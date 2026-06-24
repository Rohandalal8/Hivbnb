const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    guests: {
        type: Number,
        default: 1
    },
    paymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "cancelled"
        ],
        default: "confirmed"
    }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);