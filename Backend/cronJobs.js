const cron = require('node-cron');
const Booking = require('./models/bookingModel');

cron.schedule('*/10 * * * *', async () => {
    try {

        const twentyFourHoursAgo = new Date(
            Date.now() - 24 * 60 * 60 * 1000
        );

        await Booking.updateMany(
            {
                status: 'pending',
                createdAt: { $lte: twentyFourHoursAgo }
            },
            {
                status: 'cancelled',
                cancelledBy: 'system'
            }
        );

    } catch (error) {
        console.error(error);
    }
});