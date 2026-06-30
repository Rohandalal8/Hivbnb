const Booking = require('../models/bookingModel');
const Listing = require('../models/listingModel');
const User = require('../models/userModel');

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { listingId, checkIn, checkOut, totalPrice, guests, paymentId } = req.body;
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            return res.status(400).json({ message: 'Invalid check-in and check-out dates!' });
        }

        const discountedPrice = listing.price - (listing.price * listing.discount) / 100;
        const subTotal = discountedPrice * nights;
        const platformFee = subTotal * 0.1;
        const totalAmount = subTotal + platformFee;

        if (totalPrice !== totalAmount) {
            return res.status(400).json({ message: 'Total price mismatch!' });
        }

        const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const booking = new Booking({ listingId, checkIn, checkOut, totalPrice, paymentId, userId: user._id });
        const savedBooking = await booking.save();
        res.status(201).json({ success: true, savedBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: 'Error creating booking', error });
    }
};

// Get bookings for a user
const myBookings = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bookings = await Booking.find({ userId: user._id }).populate('listingId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

// get profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            firebaseUid: req.firebaseUser.uid
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get bookings for host
const getOwnerBookings = async (req, res) => {
    try {
        const owner = await User.findOne({ firebaseUid: req.firebaseUser.uid });

        if (!owner) {
            return res.status(404).json({ message: 'User not found' });
        }
        const bookings = await Booking.find().populate({path: 'listingId', match: { ownerId: owner._id }}).populate('userId', 'name email');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching owner bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

// update booking status
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, cancelledBy } = req.body;
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        booking.status = status;
        booking.cancelledBy = cancelledBy;
        await booking.save();
        res.json({ message: 'Booking status updated', booking });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Error updating booking status', error });
    }
};

module.exports = {
    createBooking,
    myBookings,
    getProfile,
    getOwnerBookings,
    updateBookingStatus
};