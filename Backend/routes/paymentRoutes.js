const express = require('express');
const { createdOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/order', protect, createdOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;