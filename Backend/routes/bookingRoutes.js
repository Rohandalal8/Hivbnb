const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createBooking, myBookings, getProfile, getOwnerBookings, getUnavailableDates, updateBookingStatus } = require('../controllers/bookingController');
const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getOwnerBookings);
router.route('/myBookings').get(protect, myBookings);
router.route('/profile').get(protect, getProfile);
router.route('/unavailable/:listingId').get(getUnavailableDates);
router.route('/:id/status').put(protect, updateBookingStatus);

module.exports = router;