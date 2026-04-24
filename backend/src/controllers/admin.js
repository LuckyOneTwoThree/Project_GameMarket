const { User, Sku } = require('../models');

// 获取管理员信息
const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'created_at']
    });
    
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取用户列表
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'created_at']
    });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取用户详情
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'role', 'steam_id', 'trade_url', 'created_at']
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 编辑用户
const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    
    await user.save();
    
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await user.destroy();
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取SKU列表
const getSkus = async (req, res) => {
  try {
    const skus = await Sku.findAll({
      attributes: ['id', 'ticker', 'display_name_cn', 'is_active']
    });
    
    res.status(200).json(skus);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 编辑SKU
const editSku = async (req, res) => {
  try {
    const { id } = req.params;
    const { ticker, display_name_cn, is_active } = req.body;
    
    const sku = await Sku.findByPk(id);
    if (!sku) {
      return res.status(404).json({ error: 'SKU not found' });
    }
    
    if (ticker) sku.ticker = ticker;
    if (display_name_cn) sku.display_name_cn = display_name_cn;
    if (is_active !== undefined) sku.is_active = is_active;
    
    await sku.save();
    
    res.status(200).json({
      id: sku.id,
      ticker: sku.ticker,
      display_name_cn: sku.display_name_cn,
      is_active: sku.is_active
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 系统状态
const getSystemStatus = async (req, res) => {
  try {
    // 这里只是模拟系统状态
    // 实际项目中，这里会返回真实的系统状态
    
    res.status(200).json({
      status: 'healthy',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAdminProfile,
  getUsers,
  getUserById,
  editUser,
  deleteUser,
  getSkus,
  editSku,
  getSystemStatus
};
