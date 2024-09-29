const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware.authenticateToken, getProfile);
router.put('/profile', authMiddleware.authenticateToken, updateProfile);

module.exports = router;
