const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/trade');
const authMiddleware = require('../middleware/auth');

// 获取交易对列表
router.get('/', tradeController.getTrades);

// 订单相关路由
// 创建订单
router.post('/orders', authMiddleware, tradeController.createOrder);

// 获取用户订单列表
router.get('/orders', authMiddleware, tradeController.getUserOrders);

// 获取订单详情
router.get('/orders/:id', authMiddleware, tradeController.getOrderDetail);

// 取消订单
router.delete('/orders/:id', authMiddleware, tradeController.cancelOrder);

// 交易对相关路由
// 获取交易对详情
router.get('/:symbol', tradeController.getTradeDetail);

// 获取订单簿
router.get('/:symbol/orders', tradeController.getOrderBook);

// 获取交易历史
router.get('/:symbol/trades', tradeController.getTradeHistory);

// 获取价格图表数据
router.get('/:symbol/chart/:timeframe', tradeController.getPriceChartData);

module.exports = router;