import React, { useState } from 'react';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  // 模拟用户数据
  const users = [
    { id: 1, username: 'user123', email: 'user123@example.com', balance: 1000, role: 'user' },
    { id: 2, username: 'player456', email: 'player456@example.com', balance: 500, role: 'user' },
    { id: 3, username: 'trader789', email: 'trader789@example.com', balance: 2000, role: 'user' },
  ];

  // 模拟交易数据
  const trades = [
    { id: 1, symbol: 'AKRED-FT-T1', price: 99.5, quantity: 2, side: 'buy', user: 'user123', time: '2026-04-23 10:30' },
    { id: 2, symbol: 'M4PRT-MW', price: 120.3, quantity: 1, side: 'sell', user: 'player456', time: '2026-04-23 11:15' },
    { id: 3, symbol: 'GLOVE-PAN-FT', price: 250.8, quantity: 1, side: 'buy', user: 'trader789', time: '2026-04-23 12:45' },
  ];

  return (
    <div className="admin">
      <div className="admin-header">
        <h1 className="page-title">管理员控制面板</h1>
        <p className="page-subtitle">管理系统用户、交易和设置</p>
      </div>
      
      <div className="admin-content">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            用户管理
          </button>
          <button 
            className={`admin-tab ${activeTab === 'trades' ? 'active' : ''}`}
            onClick={() => setActiveTab('trades')}
          >
            交易管理
          </button>
          <button 
            className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            系统设置
          </button>
        </div>

        <div className="admin-body">
          {activeTab === 'users' && (
            <div className="users-section fade-in">
              <div className="card">
                <div className="section-header">
                  <h2 className="section-title">用户管理</h2>
                  <button className="btn btn-primary">添加用户</button>
                </div>
                <div className="users-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>用户名</th>
                        <th>邮箱</th>
                        <th>余额</th>
                        <th>角色</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>${user.balance}</td>
                          <td>
                            <span className={`tag ${user.role === 'admin' ? 'tag-warning' : 'tag-info'}`}>
                              {user.role === 'admin' ? '管理员' : '用户'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn btn-outline btn-sm">编辑</button>
                              <button className="btn btn-danger btn-sm">删除</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trades' && (
            <div className="trades-section fade-in">
              <div className="card">
                <div className="section-header">
                  <h2 className="section-title">交易管理</h2>
                  <div className="search-bar">
                    <input type="text" placeholder="搜索交易..." className="input" />
                  </div>
                </div>
                <div className="trades-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>资产</th>
                        <th>价格</th>
                        <th>数量</th>
                        <th>方向</th>
                        <th>用户</th>
                        <th>时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((trade, index) => (
                        <tr key={trade.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                          <td>{trade.id}</td>
                          <td>{trade.symbol}</td>
                          <td>${trade.price}</td>
                          <td>{trade.quantity}</td>
                          <td>
                            <span className={`tag ${trade.side === 'buy' ? 'tag-success' : 'tag-danger'}`}>
                              {trade.side === 'buy' ? '买入' : '卖出'}
                            </span>
                          </td>
                          <td>{trade.user}</td>
                          <td>{trade.time}</td>
                          <td>
                            <button className="btn btn-outline btn-sm">查看</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section fade-in">
              <div className="card">
                <div className="section-header">
                  <h2 className="section-title">系统设置</h2>
                </div>
                <div className="settings-form">
                  <div className="input-group">
                    <label>平台名称</label>
                    <input type="text" defaultValue="Game Market" className="input" />
                  </div>
                  <div className="input-group">
                    <label>交易手续费</label>
                    <input type="number" defaultValue="0.1" step="0.01" className="input" />
                    <span className="input-suffix">%</span>
                  </div>
                  <div className="input-group">
                    <label>最小交易金额</label>
                    <input type="number" defaultValue="1" step="0.01" className="input" />
                    <span className="input-suffix">USDT</span>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span>启用维护模式</span>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span>启用新用户注册</span>
                    </label>
                  </div>
                  <button className="btn btn-primary btn-block">保存设置</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;