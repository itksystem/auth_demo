const express = require('express');
const router = express.Router();
const { create, status, order, orders } = require('../controllers/ordersController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/orders', authMiddleware.authenticateToken, orders); // получить все заказы
router.post('/orders/create', authMiddleware.authenticateToken, create); // создать заказ
router.patch('/orders/status', authMiddleware.authenticateToken, status); // установить статус
router.get('/orders/:id', authMiddleware.authenticateToken, order); // получить данные по заказу

module.exports = router;
