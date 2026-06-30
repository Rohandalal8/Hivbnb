const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
require('./cronJobs'); // Import the cron jobs
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

app.get('/', (req, res) => {
    res.send('Hivbnb API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});