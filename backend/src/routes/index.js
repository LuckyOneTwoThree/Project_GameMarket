const express = require('express');
const router = express.Router();

// 导入路由
const userRoutes = require('./user');
const tradeRoutes = require('./trade');
const assetRoutes = require('./asset');
const walletRoutes = require('./wallet');
const notificationRoutes = require('./notification');
const apiRoutes = require('./api');
const adminRoutes = require('./admin');

// 注册路由
router.use('/api/users', userRoutes);
router.use('/api/trades', tradeRoutes);
router.use('/api/assets', assetRoutes);
router.use('/api/wallets', walletRoutes);
router.use('/api/notifications', notificationRoutes);
router.use('/api', apiRoutes);
router.use('/api/admin', adminRoutes);

// 健康检查
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 根路径
router.get('/', (req, res) => {
  res.json({ 
    message: 'Game Market API', 
    version: '1.0.0',
    status: 'ok'
  });
});

module.exports = router;