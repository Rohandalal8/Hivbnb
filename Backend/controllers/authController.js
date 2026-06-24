const User = require('../models/userModel');

const registerUser = async (req, res) => {
    const { firebaseUid, name, email } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ firebaseUid });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({ firebaseUid, name, email });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
};

module.exports = { registerUser };