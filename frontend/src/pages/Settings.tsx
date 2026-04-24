import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Settings: React.FC = () => {
  // 模拟用户数据
  const [userData, setUserData] = useState({
    username: 'user123',
    email: 'user@example.com',
    steamId: '123456789',
    tradeUrl: 'https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=abcdef'
  });
  
  // 密码表单数据
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // 处理基本信息变更
  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理密码变更
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  

  
  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState({
    trade_notifications: true,
    security_notifications: true,
    market_notifications: false
  });
  
  // 从后端API获取通知设置
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const settingsData = await apiService.notification.getSettings();
        setNotificationSettings(settingsData.data);
      } catch (error) {
        console.error('Error fetching notification settings:', error);
      }
    };

    fetchNotificationSettings();
  }, []);

  // 处理修改密码
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('新密码和确认密码不一致');
      return;
    }
    
    try {
      await apiService.auth.updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      alert('密码已修改');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('密码修改失败，请检查旧密码');
    }
  };

  // 处理保存基本信息
  const handleSaveBasicInfo = async () => {
    try {
      await apiService.auth.updateProfile({
        username: userData.username,
        email: userData.email
      });
      alert('基本信息已保存');
    } catch (error) {
      console.error('Error saving basic info:', error);
      alert('保存失败，请检查输入');
    }
  };

  // 处理保存Steam账户信息
  const handleSaveSteamInfo = async () => {
    try {
      await apiService.auth.linkSteam({
        steam_id: userData.steamId,
        trade_url: userData.tradeUrl
      });
      alert('Steam账户信息已保存');
    } catch (error) {
      console.error('Error saving Steam info:', error);
      alert('保存失败，请检查输入');
    }
  };

  // 处理保存通知设置
  const handleSaveNotificationSettings = async () => {
    try {
      await apiService.notification.updateSettings(notificationSettings);
      alert('通知设置已保存');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('保存失败，请重试');
    }
  };
  
  return (
    <div className="settings">
      <div className="settings-header">
        <h1 className="page-title">个人设置</h1>
        <p className="page-subtitle">管理您的账户信息和安全设置</p>
      </div>
      
      <div className="settings-content">
        {/* 基本信息 */}
        <div className="settings-section fade-in">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title-small">基本信息</h2>
            </div>
            <div className="settings-form">
              <div className="input-group">
                <label>用户名</label>
                <input 
                  type="text" 
                  className="input"
                  name="username"
                  value={userData.username}
                  onChange={handleUserDataChange}
                />
              </div>
              <div className="input-group">
                <label>邮箱</label>
                <input 
                  type="email" 
                  className="input"
                  name="email"
                  value={userData.email}
                  onChange={handleUserDataChange}
                />
              </div>
              <button className="btn btn-primary btn-block" onClick={handleSaveBasicInfo}>保存</button>
            </div>
          </div>
        </div>
        
        {/* Steam 账户 */}
        <div className="settings-section fade-in">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title-small">Steam 账户</h2>
            </div>
            <div className="settings-form">
              <div className="input-group">
                <label>Steam ID</label>
                <input 
                  type="text" 
                  className="input"
                  name="steamId"
                  value={userData.steamId}
                  onChange={handleUserDataChange}
                />
              </div>
              <div className="input-group">
                <label>交易 URL</label>
                <input 
                  type="text" 
                  className="input"
                  name="tradeUrl"
                  value={userData.tradeUrl}
                  onChange={handleUserDataChange}
                />
              </div>
              <button className="btn btn-primary btn-block" onClick={handleSaveSteamInfo}>保存</button>
            </div>
          </div>
        </div>
        
        {/* 安全设置 */}
        <div className="settings-section fade-in">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title-small">安全设置</h2>
            </div>
            <div className="settings-form">
              <div className="input-group">
                <label>旧密码</label>
                <input 
                  type="password" 
                  placeholder="输入旧密码" 
                  className="input"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="input-group">
                <label>新密码</label>
                <input 
                  type="password" 
                  placeholder="输入新密码" 
                  className="input"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="input-group">
                <label>确认新密码</label>
                <input 
                  type="password" 
                  placeholder="确认新密码" 
                  className="input"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <button className="btn btn-danger btn-block" onClick={handleChangePassword}>修改密码</button>
            </div>
          </div>
        </div>
        
        {/* 通知设置 */}
        <div className="settings-section fade-in">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title-small">通知设置</h2>
            </div>
            <div className="settings-form">
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.trade_notifications}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, trade_notifications: e.target.checked }))}
                  />
                  <span>接收交易通知</span>
                </label>
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.security_notifications}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, security_notifications: e.target.checked }))}
                  />
                  <span>接收账户安全通知</span>
                </label>
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.market_notifications}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, market_notifications: e.target.checked }))}
                  />
                  <span>接收市场行情通知</span>
                </label>
              </div>
              <button className="btn btn-primary btn-block" onClick={handleSaveNotificationSettings}>保存通知设置</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;