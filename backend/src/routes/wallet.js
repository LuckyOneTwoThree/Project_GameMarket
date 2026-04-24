const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet');
const authMiddleware = require('../middleware/auth');

// 获取钱包余额
router.get('/', authMiddleware, walletController.getBalances);

// 充值资金
router.post('/deposit', authMiddleware, walletController.deposit);

// 提现资金
router.post('/withdraw', authMiddleware, walletController.withdraw);

// 获取资金历史记录
router.get('/history', authMiddleware, walletController.getTransactionHistory);

module.exports = router;
