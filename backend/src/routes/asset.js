const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset');
const authMiddleware = require('../middleware/auth');

// 获取用户资产列表
router.get('/', authMiddleware, assetController.getAssets);

// 充值资产
router.post('/deposit', authMiddleware, assetController.depositAsset);

// 提现资产
router.post('/withdraw', authMiddleware, assetController.withdrawAsset);

// 获取充值历史
router.get('/deposit/history', authMiddleware, assetController.getDepositHistory);

// 获取提现历史
router.get('/withdraw/history', authMiddleware, assetController.getWithdrawHistory);

// 获取充值状态
router.get('/deposit/:id/status', authMiddleware, assetController.getDepositStatus);

// 获取提现状态
router.get('/withdraw/:id/status', authMiddleware, assetController.getWithdrawStatus);

module.exports = router;