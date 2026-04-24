const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authMiddleware = require('../middleware/auth');

// 管理员认证中间件
const adminAuthMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};

// 获取用户列表
router.get('/users', authMiddleware, adminAuthMiddleware, adminController.getUsers);

// 获取用户详情
router.get('/users/:id', authMiddleware, adminAuthMiddleware, adminController.getUserById);

// 编辑用户
router.put('/users/:id', authMiddleware, adminAuthMiddleware, adminController.editUser);

// 删除用户
router.delete('/users/:id', authMiddleware, adminAuthMiddleware, adminController.deleteUser);

// 获取SKU列表
router.get('/skus', authMiddleware, adminAuthMiddleware, adminController.getSkus);

// 编辑SKU
router.put('/skus/:id', authMiddleware, adminAuthMiddleware, adminController.editSku);

// 获取管理员信息
router.get('/profile', authMiddleware, adminAuthMiddleware, adminController.getAdminProfile);

// 获取系统状态
router.get('/status', authMiddleware, adminAuthMiddleware, adminController.getSystemStatus);

module.exports = router;
