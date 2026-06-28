const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createBooking, myBookings, getProfile } = require('../controllers/bookingController');
const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/myBookings').get(protect, myBookings);
router.route('/profile').get(protect, getProfile);

module.exports = router;