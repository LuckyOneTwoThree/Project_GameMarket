const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');
const authMiddleware = require('../middleware/auth');

// 获取用户通知设置
router.get('/', authMiddleware, notificationController.getNotificationSettings);

// 更新用户通知设置
router.put('/', authMiddleware, notificationController.updateNotificationSettings);

module.exports = router;
