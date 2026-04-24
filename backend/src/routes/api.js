const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api');
const authMiddleware = require('../middleware/auth');

// 批量创建订单
router.post('/mm/orders', authMiddleware, apiController.batchCreateOrders);

// 批量取消订单
router.delete('/mm/orders', authMiddleware, apiController.batchCancelOrders);

// 获取用户订单统计
router.get('/orders/stats', authMiddleware, apiController.getUserOrderStats);

// 获取市场统计数据
router.get('/market/stats/:symbol', authMiddleware, apiController.getMarketStats);

// 批量获取资产
router.post('/assets/batch', authMiddleware, apiController.batchGetAssets);

// 获取用户资产统计
router.get('/assets/stats', authMiddleware, apiController.getUserAssetStats);

module.exports = router;
