const mongoose = require('mongoose');

let connectionPromise;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log('Connected to MongoDB');
                return mongoose.connection;
            })
            .catch((err) => {
                connectionPromise = undefined;
                throw err;
            });
    }

    try {
        return await connectionPromise;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        throw err;
    }
};

module.exports = connectDB;