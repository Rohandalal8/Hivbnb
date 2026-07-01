const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { owner } = require('../middlewares/ownerMiddleware');
const { admin } = require('../middlewares/adminMiddleware');
const { createBooking, myBookings, getProfile, getOwnerBookings, getUnavailableDates, updateBookingStatus, cancelBooking, allBookings } = require('../controllers/bookingController');
const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getOwnerBookings);
router.route('/myBookings').get(protect, myBookings);
router.route('/allBookings').get(protect, admin, allBookings);
router.route('/profile').get(protect, getProfile);
router.route('/unavailable/:listingId').get(getUnavailableDates);
router.route('/status/:id').put(protect, updateBookingStatus);
router.route('/user-cancel/:id').put(protect, cancelBooking)

module.exports = router;