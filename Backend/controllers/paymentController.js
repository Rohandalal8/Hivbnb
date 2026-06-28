const instance = require('../config/razorpay');
const crypto = require('crypto');
const Listing = require('../models/listingModel');

const createdOrder = async (req, res) => {
    try {
        const { listingId, checkIn, checkOut } = req.body;

        if (!listingId || !checkIn || !checkOut) {
            return res.status(400).json({ message: 'Missing required booking details!' });
        }

        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(400).json({ message: 'Listing not found!' });
        }

        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            return res.status(400).json({ message: 'Invalid check-in and check-out dates!' });
        }

        const discountedPrice = listing.price - (listing.price * listing.discount) / 100;
        const subTotal = discountedPrice * nights;
        const platformFee = subTotal * 0.1; // 10% platform fee
        const totalAmount = subTotal + platformFee;

        const options = {
            amount: Math.round(totalAmount * 100), // Convert to smallest currency unit
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex'),
        };

        const order = await instance.orders.create(options);

        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature === razorpay_signature) {
            res.json({success: true, message: 'Payment verified successfully!' });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed!' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    createdOrder, 
    verifyPayment 
}; 