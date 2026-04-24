import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('请输入邮箱和密码');
      return;
    }

    try {
      // 调用后端登录API
      const response = await apiService.auth.login({ email, password, isAdmin: isAdminLogin });
      const userData = response.data || response;
      
      // 存储token和用户信息
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role
      }));
      
      // 登录成功后跳转
      if (isAdminLogin) {
        // 管理员登录
        navigate('/admin');
      } else {
        // 用户登录
        navigate('/');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || '登录失败，请检查邮箱和密码');
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
            <p className="login-subtitle">登录您的账户</p>
          </div>
        </div>
        
        <div className="login-form-container">
          <div className="login-tabs">
            <button 
              className={`login-tab ${!isAdminLogin ? 'active' : ''}`}
              onClick={() => setIsAdminLogin(false)}
            >
              用户登录
            </button>
            <button 
              className={`login-tab ${isAdminLogin ? 'active' : ''}`}
              onClick={() => setIsAdminLogin(true)}
            >
              管理员登录
            </button>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
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
            
            <div className="login-options">
              <div className="remember-me">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>记住我</span>
                </label>
              </div>
              <Link to="#" className="forgot-password">忘记密码?</Link>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              {isAdminLogin ? '管理员登录' : '登录'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>还没有账户? <Link to="/register" className="register-link">立即注册</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;