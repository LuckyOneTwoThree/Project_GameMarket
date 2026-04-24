const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 注册
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Register request:', { email });
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 自动生成用户名（基于邮箱）
    const username = email.split('@')[0];
    
    // 创建用户
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role: 'user'
    });
    
    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log('User registered successfully');
    
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 登录
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request:', { email });
    
    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('User found:', user.id);
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('Password valid');
    
    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    console.log('Token generated');
    
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取个人信息
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role', 'steam_id', 'trade_url', 'created_at']
    });
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新个人信息
const updateProfile = async (req, res) => {
  try {
    const { username, trade_url } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    if (username) user.username = username;
    if (trade_url) user.trade_url = trade_url;
    
    await user.save();
    
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      trade_url: user.trade_url
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 修改密码
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    // 验证当前密码
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid current password' });
    }
    
    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 关联 Steam 账户
const linkSteamAccount = async (req, res) => {
  try {
    const { steam_id, trade_url } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (steam_id) user.steam_id = steam_id;
    if (trade_url) user.trade_url = trade_url;
    await user.save();
    
    res.status(200).json({ message: 'Steam account linked successfully' });
  } catch (error) {
    console.error('Error linking Steam account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 解除 Steam 账户关联
const unlinkSteamAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    user.steam_id = null;
    await user.save();
    
    res.status(200).json({ message: 'Steam account unlinked successfully' });
  } catch (error) {
    console.error('Error unlinking Steam account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  linkSteamAccount,
  unlinkSteamAccount
};
