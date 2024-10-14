const express = require('express');
const router = express.Router();
const { deposit, balance } = require('../controllers/accountController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/account/deposit', authMiddleware.authenticateToken, deposit); // получить все заказы
router.get('/account/balance', authMiddleware.authenticateToken, balance); // получить все заказы

module.exports = router;
