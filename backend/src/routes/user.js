const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/auth');

// 注册
router.post('/register', userController.register);

// 登录
router.post('/login', userController.login);

// 获取用户信息
router.get('/profile', authMiddleware, userController.getProfile);

// 更新用户信息
router.put('/profile', authMiddleware, userController.updateProfile);

// 修改密码
router.put('/password', authMiddleware, userController.changePassword);

// 关联 Steam 账户
router.post('/steam/link', authMiddleware, userController.linkSteamAccount);

// 解除 Steam 账户关联
router.post('/steam/unlink', authMiddleware, userController.unlinkSteamAccount);

module.exports = router;
