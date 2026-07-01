const Booking = require('../models/bookingModel');
const Listing = require('../models/listingModel');
const User = require('../models/userModel');

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { listingId, checkIn, checkOut, totalPrice, paymentId } = req.body;
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        const tommorrow = new Date();
        tommorrow.setHours(0, 0, 0, 0);
        tommorrow.setDate(tommorrow.getDate() + 1);

        const existingBooking = await Booking.findOne({
            listingId,
            status: { $ne: "cancelled" },
            checkIn: { $lt: endDate },
            checkOut: { $gt: startDate }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Listing is not available for the selected dates!' });
        }

        if (startDate < tommorrow) {
            return res.status(400).json({ message: 'Bookings must be made at least 24 hours in advance!' });
        }

        if (checkIn >= checkOut) {
            return res.status(400).json({ message: "Check-out must be after check-in" });
        }

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
        const bookings = await Booking.find().populate({ path: 'listingId', match: { ownerId: owner._id } }).populate('userId', 'name email');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching owner bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

const getUnavailableDates = async (req, res) => {
    try {
        const bookings = await Booking.find({
            listingId: req.params.listingId,
            status: { $ne: "cancelled" }
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching unavailable dates:', error);
        res.status(500).json({ message: error.message });
    }
};

// update booking status
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'cancelled' || booking.status === 'confirmed') {
            return res.status(400).json({ message: 'Booking status cannot be updated' });
        }

        const diffHours = (Date.now() - booking.createdAt.getTime()) / (1000 * 60 * 60);
        if (diffHours > 24) {
            return res.status(400).json({ message: 'Response window has expired' });
        }

        booking.status = status;
        if (status === 'cancelled') {
            booking.cancelledBy = 'host';
        }
        await booking.save();
        res.json({ message: 'Booking status updated', booking });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Error updating booking status', error });
    }
};

// user cancel booking
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (new Date(booking.checkIn) <= new Date()) {
            return res.status(400).json({ message: 'Booking cannot be cancelled as check-in date has passed' });
        }

        booking.status = 'cancelled';
        booking.cancelledBy = 'user';
        await booking.save();
        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking', error });
    }
};

const allBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('listingId').populate('userId', 'name email');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ message: 'Error fetching all bookings', error });
    }
};

module.exports = {
    createBooking,
    myBookings,
    getProfile,
    getOwnerBookings,
    getUnavailableDates,
    updateBookingStatus,
    cancelBooking,
    allBookings
};