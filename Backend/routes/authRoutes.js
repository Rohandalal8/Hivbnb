const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', protect, registerUser);

module.exports = router;