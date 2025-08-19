const express = require('express');
const { 
  registerUser, 
  loginUser 
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route example
// router.get('/me', protect, getUserProfile);

module.exports = router;