import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!email || !password || !confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      // 调用后端注册API
      const response = await apiService.auth.register({ email, password });
      const userData = response.data || response;
      
      setError('');
      setSuccess('注册成功！正在跳转到登录页面...');
      
      // 3秒后跳转到登录页面
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.response?.data?.error || '注册失败，请稍后重试');
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h1 className="login-title">Game Market</h1>
            <p className="login-subtitle">注册新账户</p>
          </div>
        </div>
        
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="input-group">
              <label>邮箱</label>
              <input 
                type="email" 
                placeholder="请输入邮箱" 
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label>密码</label>
              <input 
                type="password" 
                placeholder="请输入密码" 
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label>确认密码</label>
              <input 
                type="password" 
                placeholder="请再次输入密码" 
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              注册
            </button>
          </form>
          
          <div className="login-footer">
            <p>已有账户? <Link to="/login" className="login-link">立即登录</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;