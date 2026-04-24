const { Notification } = require('../models');

// 获取用户通知设置
const getNotificationSettings = async (req, res) => {
  try {
    let settings = await Notification.findOne({ where: { user_id: req.user.id } });
    
    // 如果用户没有通知设置记录，创建默认设置
    if (!settings) {
      settings = await Notification.create({
        user_id: req.user.id,
        email_notifications: true,
        push_notifications: true,
        trade_notifications: true,
        price_notifications: false,
        system_notifications: true
      });
    }
    
    res.status(200).json({
      emailNotifications: settings.email_notifications,
      pushNotifications: settings.push_notifications,
      tradeNotifications: settings.trade_notifications,
      priceNotifications: settings.price_notifications,
      systemNotifications: settings.system_notifications
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新用户通知设置
const updateNotificationSettings = async (req, res) => {
  try {
    const {
      emailNotifications,
      pushNotifications,
      tradeNotifications,
      priceNotifications,
      systemNotifications
    } = req.body;
    
    let settings = await Notification.findOne({ where: { user_id: req.user.id } });
    
    if (!settings) {
      // 如果用户没有通知设置记录，创建新记录
      settings = await Notification.create({
        user_id: req.user.id,
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        trade_notifications: tradeNotifications,
        price_notifications: priceNotifications,
        system_notifications: systemNotifications
      });
    } else {
      // 更新现有设置
      settings.email_notifications = emailNotifications;
      settings.push_notifications = pushNotifications;
      settings.trade_notifications = tradeNotifications;
      settings.price_notifications = priceNotifications;
      settings.system_notifications = systemNotifications;
      
      await settings.save();
    }
    
    res.status(200).json({
      emailNotifications: settings.email_notifications,
      pushNotifications: settings.push_notifications,
      tradeNotifications: settings.trade_notifications,
      priceNotifications: settings.price_notifications,
      systemNotifications: settings.system_notifications
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 发送测试通知
const sendTestNotification = async (req, res) => {
  try {
    // 这里只是模拟发送通知
    // 实际项目中，这里会调用通知服务发送真实的通知
    
    res.status(200).json({ message: 'Test notification sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNotificationSettings,
  updateNotificationSettings,
  sendTestNotification
};
