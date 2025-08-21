const express = require('express');
const { 
  registerUser, 
  loginUser,
  getUserInfo 
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route to get user info
router.get('/getUserInfo', protect, getUserInfo);

module.exports = router;