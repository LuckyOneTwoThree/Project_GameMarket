import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

// 提现对话框样式
const modalStyles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 18px;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  
  .modal-body {
    margin-bottom: 20px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .input-group {
    margin-bottom: 15px;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  }
  
  .input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .input-error {
    border-color: #ff4d4f;
  }
  
  .error-message {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 5px;
  }
  
  .form-success {
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    color: #52c41a;
  }
  
  .form-success svg {
    margin-right: 8px;
  }
  
  .btn {
    padding: 8px 16px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #1890ff;
    color: white;
    border-color: #1890ff;
  }
  
  .btn-outline {
    background-color: white;
  }
`;

// 添加样式到页面
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = modalStyles;
  document.head.appendChild(style);
}

const Assets: React.FC = () => {
  // 资产数据
  const [assets, setAssets] = useState([
    { id: 1, symbol: 'AKRED-FT-T1', quantity: 10, status: 'available', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20AK-47%20Redline%20Field%20Tested%20skin%20preview&image_size=square' },
    { id: 2, symbol: 'M4PRT-MW', quantity: 5, status: 'available', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20M4A4%20Printstream%20Minimal%20Wear%20skin%20preview&image_size=square' },
    { id: 3, symbol: 'GLOVE-PAN-FT', quantity: 2, status: 'available', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20Sport%20Gloves%20Pandoras%20Box%20Field%20Tested%20skin%20preview&image_size=square' },
    { id: 4, symbol: 'KARAM-DOP-P1', quantity: 3, status: 'locked', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20Karambit%20Doppler%20Phase%201%20skin%20preview&image_size=square' }
  ]);
  
  // 充值历史
  const [depositHistory, setDepositHistory] = useState([
    { id: 1, symbol: 'AKRED-FT-T1', quantity: 5, status: 'completed', timestamp: new Date().toISOString() },
    { id: 2, symbol: 'M4PRT-MW', quantity: 3, status: 'completed', timestamp: new Date().toISOString() },
    { id: 3, symbol: 'GLOVE-PAN-FT', quantity: 1, status: 'pending', timestamp: new Date().toISOString() }
  ]);
  
  // 提现历史
  const [withdrawHistory, setWithdrawHistory] = useState([
    { id: 1, symbol: 'KARAM-DOP-P1', quantity: 1, status: 'completed', timestamp: new Date().toISOString() },
    { id: 2, symbol: 'AKRED-FT-T1', quantity: 2, status: 'pending', timestamp: new Date().toISOString() }
  ]);
  
  // 充值表单数据
  const [depositAsset, setDepositAsset] = useState('AKRED-FT-T1');
  const [depositQuantity, setDepositQuantity] = useState('');
  const [formErrors, setFormErrors] = useState<{ quantity?: string }>({});
  const [formSuccess, setFormSuccess] = useState<string>('');
  
  // 提现表单数据
  const [withdrawAsset, setWithdrawAsset] = useState('AKRED-FT-T1');
  const [withdrawQuantity, setWithdrawQuantity] = useState('');
  const [withdrawTradeUrl, setWithdrawTradeUrl] = useState('');
  const [withdrawErrors, setWithdrawErrors] = useState<{ quantity?: string; tradeUrl?: string }>({});
  const [withdrawSuccess, setWithdrawSuccess] = useState<string>('');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  
  // 排序状态
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  
  // 分页状态
  const [assetsPage, setAssetsPage] = useState(1);
  const [depositPage, setDepositPage] = useState(1);
  const [withdrawPage, setWithdrawPage] = useState(1);
  const itemsPerPage = 5;
  
  // Tab切换状态
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  
  // 排序函数
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    const sortedAssets = [...assets].sort((a, b) => {
      if (a[key as keyof typeof a] < b[key as keyof typeof b]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key as keyof typeof a] > b[key as keyof typeof b]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setAssets(sortedAssets);
  };
  
  // 获取排序图标
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return '↕️';
    }
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };
  
  // 计算分页数据
  const indexOfLastAsset = assetsPage * itemsPerPage;
  const indexOfFirstAsset = indexOfLastAsset - itemsPerPage;
  const currentAssets = assets.slice(indexOfFirstAsset, indexOfLastAsset);
  
  const indexOfLastDeposit = depositPage * itemsPerPage;
  const indexOfFirstDeposit = indexOfLastDeposit - itemsPerPage;
  const currentDeposits = depositHistory.slice(indexOfFirstDeposit, indexOfLastDeposit);
  
  const indexOfLastWithdraw = withdrawPage * itemsPerPage;
  const indexOfFirstWithdraw = indexOfLastWithdraw - itemsPerPage;
  const currentWithdraws = withdrawHistory.slice(indexOfFirstWithdraw, indexOfLastWithdraw);
  
  // 计算总页数
  const totalAssetsPages = Math.ceil(assets.length / itemsPerPage);
  const totalDepositPages = Math.ceil(depositHistory.length / itemsPerPage);
  const totalWithdrawPages = Math.ceil(withdrawHistory.length / itemsPerPage);
  
  // 从后端API获取资产数据
  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        // 获取用户资产列表
        const assetsData = await apiService.asset.getAssets();
        if (assetsData && Array.isArray(assetsData) && assetsData.length > 0) {
          const newAssets = assetsData.map((asset: any) => ({
            id: asset.id,
            symbol: asset.symbol,
            quantity: asset.quantity,
            status: asset.status,
            icon: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20${asset.symbol}%20skin%20preview&image_size=square`
          }));
          setAssets(newAssets);
        }

        // 获取充值历史
        const depositHistoryData = await apiService.asset.getDepositHistory();
        setDepositHistory(Array.isArray(depositHistoryData) ? depositHistoryData : []);

        // 获取提现历史
        const withdrawHistoryData = await apiService.asset.getWithdrawHistory();
        setWithdrawHistory(Array.isArray(withdrawHistoryData) ? withdrawHistoryData : []);
      } catch (error) {
        console.error('Error fetching asset data:', error);
      }
    };

    fetchAssetData();
  }, []);

  // 充值表单验证函数
  const validateDepositForm = () => {
    const errors: { quantity?: string } = {};
    
    if (!depositQuantity) {
      errors.quantity = '请输入数量';
    } else if (isNaN(Number(depositQuantity)) || Number(depositQuantity) <= 0) {
      errors.quantity = '请输入有效的正数';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 提现表单验证函数
  const validateWithdrawForm = () => {
    const errors: { quantity?: string; tradeUrl?: string } = {};
    
    if (!withdrawQuantity) {
      errors.quantity = '请输入数量';
    } else if (isNaN(Number(withdrawQuantity)) || Number(withdrawQuantity) <= 0) {
      errors.quantity = '请输入有效的正数';
    }
    
    if (!withdrawTradeUrl) {
      errors.tradeUrl = '请输入Steam交易URL';
    }
    
    setWithdrawErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 充值表单处理函数
  const handleDeposit = async () => {
    if (validateDepositForm()) {
      try {
        // 直接使用资产符号作为SKU ID（假设符号与SKU的ticker一致）
        const assetId = depositAsset;
        
        // 调用后端充值API
        await apiService.asset.depositAsset({
          assetId: assetId,
          quantity: parseFloat(depositQuantity)
        });
        
        setFormSuccess('交易报价已生成，请查看您的Steam交易报价');
        setDepositQuantity('');
        
        // 3秒后清除成功消息
        setTimeout(() => {
          setFormSuccess('');
        }, 3000);
        
        // 重新获取资产数据
        const assetsData = await apiService.asset.getAssets();
        if (assetsData && Array.isArray(assetsData) && assetsData.length > 0) {
          const newAssets = assetsData.map((asset: any) => ({
            id: asset.id,
            symbol: asset.symbol,
            quantity: asset.quantity,
            status: asset.status,
            icon: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20${asset.symbol}%20skin%20preview&image_size=square`
          }));
          setAssets(newAssets);
        }
        
        // 重新获取充值历史
        const depositHistoryData = await apiService.asset.getDepositHistory();
        setDepositHistory(Array.isArray(depositHistoryData) ? depositHistoryData : []);
        
        // 重新获取提现历史
        const withdrawHistoryData = await apiService.asset.getWithdrawHistory();
        setWithdrawHistory(Array.isArray(withdrawHistoryData) ? withdrawHistoryData : []);
      } catch (error) {
        console.error('Error depositing asset:', error);
        setFormSuccess('充值失败，请检查Steam账户设置');
        setTimeout(() => {
          setFormSuccess('');
        }, 3000);
      }
    }
  };
  
  // 处理提现按钮点击
  const handleWithdrawButtonClick = (asset: any) => {
    setSelectedAsset(asset);
    setWithdrawAsset(asset.symbol);
    setWithdrawQuantity('');
    setWithdrawTradeUrl('');
    setWithdrawErrors({});
    setWithdrawSuccess('');
    setIsWithdrawModalOpen(true);
  };
  
  // 关闭提现对话框
  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
    setSelectedAsset(null);
  };
  
  // 提现表单处理函数
  const handleWithdraw = async () => {
    if (validateWithdrawForm()) {
      try {
        // 调用后端提现API
        await apiService.asset.withdrawAsset({
          symbol: withdrawAsset,
          quantity: parseFloat(withdrawQuantity),
          tradeUrl: withdrawTradeUrl
        });
        
        setWithdrawSuccess('提现请求已提交，请查看您的Steam交易报价');
        setWithdrawQuantity('');
        setWithdrawTradeUrl('');
        
        // 3秒后清除成功消息并关闭对话框
        setTimeout(() => {
          setWithdrawSuccess('');
          setIsWithdrawModalOpen(false);
          setSelectedAsset(null);
        }, 3000);
        
        // 重新获取资产数据
        const assetsData = await apiService.asset.getAssets();
        if (assetsData && Array.isArray(assetsData) && assetsData.length > 0) {
          const newAssets = assetsData.map((asset: any) => ({
            id: asset.id,
            symbol: asset.symbol,
            quantity: asset.quantity,
            status: asset.status,
            icon: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20${asset.symbol}%20skin%20preview&image_size=square`
          }));
          setAssets(newAssets);
        }
        
        // 重新获取充值历史
        const depositHistoryData = await apiService.asset.getDepositHistory();
        setDepositHistory(Array.isArray(depositHistoryData) ? depositHistoryData : []);
        
        // 重新获取提现历史
        const withdrawHistoryData = await apiService.asset.getWithdrawHistory();
        setWithdrawHistory(Array.isArray(withdrawHistoryData) ? withdrawHistoryData : []);
      } catch (error) {
        console.error('Error withdrawing asset:', error);
        setWithdrawSuccess('提现失败，请检查Steam账户设置');
        setTimeout(() => {
          setWithdrawSuccess('');
        }, 3000);
      }
    }
  };
  
  return (
    <div className="assets">
      <div className="assets-header">
        <h1 className="page-title">资产中心</h1>
        <p className="page-subtitle">管理和查看您的所有游戏资产</p>
      </div>
      
      {/* 资产概览 - 紧凑横向卡片 */}
      <div className="assets-overview">
        <div className="overview-container">
          <div className="overview-wrapper">
            <div className="overview-scroll">
              {assets.map((asset, index) => (
                <div key={asset.id} className="overview-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="overview-card-icon">
                  <img src={asset.icon} alt={asset.symbol} className="asset-icon-image" />
                </div>
                <div className="overview-card-header">
                  <span className="overview-asset-symbol">{asset.symbol}</span>
                  <span className={`tag ${asset.status === 'available' ? 'tag-success' : 'tag-warning'}`}>
                    {asset.status === 'available' ? '可用' : '锁定'}
                  </span>
                </div>
                <div className="overview-asset-quantity">{asset.quantity}</div>
                <div className="overview-asset-actions">
                  <button className="btn btn-sm btn-outline" disabled={asset.status === 'locked'} onClick={() => handleWithdrawButtonClick(asset)}>提现</button>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 主体内容区 - 两栏布局 */}
      <div className="assets-main">
        {/* 左栏 - 我的资产表格 */}
        <div className="assets-left">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title-small">我的资产</h2>
              <span className="section-badge">{assets.length} 项资产</span>
            </div>
            <div className="assets-table">
              <table className="table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort('symbol')} className="sortable">
                      资产 {getSortIcon('symbol')}
                    </th>
                    <th onClick={() => requestSort('quantity')} className="sortable">
                      数量 {getSortIcon('quantity')}
                    </th>
                    <th onClick={() => requestSort('status')} className="sortable">
                      状态 {getSortIcon('status')}
                    </th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAssets.map((asset, index) => (
                    <tr key={asset.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td>
                        <span className="asset-symbol">{asset.symbol}</span>
                      </td>
                      <td>
                        <span className="asset-quantity-value">{asset.quantity}</span>
                      </td>
                      <td>
                        <span className={`tag ${asset.status === 'available' ? 'tag-success' : 'tag-warning'}`}>
                          {asset.status === 'available' ? '可用' : '锁定'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-xs btn-outline" disabled={asset.status === 'locked'} onClick={() => handleWithdrawButtonClick(asset)}>
                          提现
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 分页组件 */}
            {totalAssetsPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', alignItems: 'center', gap: '6px' }}>
                <button 
                  className="btn btn-xs" 
                  onClick={() => setAssetsPage(prev => Math.max(prev - 1, 1))}
                  disabled={assetsPage === 1}
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  上一页
                </button>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {assetsPage}/{totalAssetsPages}
                </span>
                <button 
                  className="btn btn-xs" 
                  onClick={() => setAssetsPage(prev => Math.min(prev + 1, totalAssetsPages))}
                  disabled={assetsPage === totalAssetsPages}
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  下一页
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* 右栏 - 充值和提现表单 */}
        <div className="assets-right">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title-small">资产操作</h2>
            </div>
            
            {/* Tab切换 */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <button 
                onClick={() => setActiveTab('deposit')}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === 'deposit' ? '600' : '400',
                  color: activeTab === 'deposit' ? 'var(--primary-color)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'deposit' ? '2px solid var(--primary-color)' : '2px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                充值资产
              </button>
              <button 
                onClick={() => setActiveTab('withdraw')}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === 'withdraw' ? '600' : '400',
                  color: activeTab === 'withdraw' ? 'var(--primary-color)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'withdraw' ? '2px solid var(--primary-color)' : '2px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                提现资产
              </button>
            </div>
            
            {/* 充值表单 */}
            {activeTab === 'deposit' && (
              <div className="deposit-form">
                {formSuccess && (
                  <div className="form-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>{formSuccess}</span>
                  </div>
                )}
                <div className="input-group">
                  <label htmlFor="deposit-asset">选择资产</label>
                  <select 
                    id="deposit-asset"
                    className="select"
                    value={depositAsset}
                    onChange={(e) => setDepositAsset(e.target.value)}
                  >
                    <option value="AKRED-FT-T1">AKRED-FT-T1</option>
                    <option value="M4PRT-MW">M4PRT-MW</option>
                    <option value="GLOVE-PAN-FT">GLOVE-PAN-FT</option>
                    <option value="KARAM-DOP-P1">KARAM-DOP-P1</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="deposit-quantity">数量</label>
                  <input 
                    id="deposit-quantity"
                    type="number" 
                    placeholder="输入数量" 
                    className={`input ${formErrors.quantity ? 'input-error' : ''}`}
                    value={depositQuantity}
                    onChange={(e) => setDepositQuantity(e.target.value)}
                  />
                  {formErrors.quantity && (
                    <div className="error-message">{formErrors.quantity}</div>
                  )}
                </div>
                <button 
                  className="btn btn-primary btn-block"
                  onClick={handleDeposit}
                >
                  生成交易报价
                </button>
                <div className="form-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>充值前请确保您已关联Steam账号</span>
                </div>
              </div>
            )}
            
            {/* 提现表单 */}
            {activeTab === 'withdraw' && (
              <div className="withdraw-form">
                {withdrawSuccess && (
                  <div className="form-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>{withdrawSuccess}</span>
                  </div>
                )}
                <div className="input-group">
                  <label htmlFor="withdraw-asset">选择资产</label>
                  <select 
                    id="withdraw-asset"
                    className="select"
                    value={withdrawAsset}
                    onChange={(e) => setWithdrawAsset(e.target.value)}
                  >
                    <option value="AKRED-FT-T1">AKRED-FT-T1</option>
                    <option value="M4PRT-MW">M4PRT-MW</option>
                    <option value="GLOVE-PAN-FT">GLOVE-PAN-FT</option>
                    <option value="KARAM-DOP-P1">KARAM-DOP-P1</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="withdraw-quantity">数量</label>
                  <input 
                    id="withdraw-quantity"
                    type="number" 
                    placeholder="输入数量" 
                    className={`input ${withdrawErrors.quantity ? 'input-error' : ''}`}
                    value={withdrawQuantity}
                    onChange={(e) => setWithdrawQuantity(e.target.value)}
                  />
                  {withdrawErrors.quantity && (
                    <div className="error-message">{withdrawErrors.quantity}</div>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="withdraw-trade-url">Steam交易URL</label>
                  <input 
                    id="withdraw-trade-url"
                    type="text" 
                    placeholder="输入Steam交易URL" 
                    className={`input ${withdrawErrors.tradeUrl ? 'input-error' : ''}`}
                    value={withdrawTradeUrl}
                    onChange={(e) => setWithdrawTradeUrl(e.target.value)}
                  />
                  {withdrawErrors.tradeUrl && (
                    <div className="error-message">{withdrawErrors.tradeUrl}</div>
                  )}
                </div>
                <button 
                  className="btn btn-primary btn-block"
                  onClick={handleWithdraw}
                >
                  提交提现请求
                </button>
                <div className="form-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>提现前请确保您已设置正确的Steam交易URL</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 历史记录区 - 两栏布局 */}
      <div className="assets-history">
        {/* 充值历史 */}
        <div className="card history-card">
          <div className="section-header">
            <h2 className="section-title-small">充值历史</h2>
            <span className="section-badge">{depositHistory.length} 条记录</span>
          </div>
          <div className="history-table">
            <table className="table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>资产</th>
                  <th>数量</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {currentDeposits.length > 0 ? (
                  currentDeposits.map((deposit, index) => (
                    <tr key={deposit.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td>
                        <div className="time-info">
                          <span className="time-date">{new Date(deposit.timestamp).toLocaleDateString()}</span>
                          <span className="time-time">{new Date(deposit.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td>
                        <span className="asset-symbol">{deposit.symbol}</span>
                      </td>
                      <td>
                        <span className="quantity-value">{deposit.quantity}</span>
                      </td>
                      <td>
                        <span className={`tag ${deposit.status === 'completed' ? 'tag-success' : 'tag-warning'}`}>
                          {deposit.status === 'completed' ? '已完成' : '处理中'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      <p>暂无充值记录</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* 分页组件 */}
          {totalDepositPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', alignItems: 'center', gap: '6px' }}>
              <button 
                className="btn btn-xs" 
                onClick={() => setDepositPage(prev => Math.max(prev - 1, 1))}
                disabled={depositPage === 1}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                上一页
              </button>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {depositPage}/{totalDepositPages}
              </span>
              <button 
                className="btn btn-xs" 
                onClick={() => setDepositPage(prev => Math.min(prev + 1, totalDepositPages))}
                disabled={depositPage === totalDepositPages}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                下一页
              </button>
            </div>
          )}
        </div>
        
        {/* 提现历史 */}
        <div className="card history-card">
          <div className="section-header">
            <h2 className="section-title-small">提现历史</h2>
            <span className="section-badge">{withdrawHistory.length} 条记录</span>
          </div>
          <div className="history-table">
            <table className="table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>资产</th>
                  <th>数量</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {currentWithdraws.length > 0 ? (
                  currentWithdraws.map((withdraw, index) => (
                    <tr key={withdraw.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td>
                        <div className="time-info">
                          <span className="time-date">{new Date(withdraw.timestamp).toLocaleDateString()}</span>
                          <span className="time-time">{new Date(withdraw.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td>
                        <span className="asset-symbol">{withdraw.symbol}</span>
                      </td>
                      <td>
                        <span className="quantity-value">{withdraw.quantity}</span>
                      </td>
                      <td>
                        <span className={`tag ${withdraw.status === 'completed' ? 'tag-success' : 'tag-warning'}`}>
                          {withdraw.status === 'completed' ? '已完成' : '处理中'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      <p>暂无提现记录</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* 分页组件 */}
          {totalWithdrawPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', alignItems: 'center', gap: '6px' }}>
              <button 
                className="btn btn-xs" 
                onClick={() => setWithdrawPage(prev => Math.max(prev - 1, 1))}
                disabled={withdrawPage === 1}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                上一页
              </button>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {withdrawPage}/{totalWithdrawPages}
              </span>
              <button 
                className="btn btn-xs" 
                onClick={() => setWithdrawPage(prev => Math.min(prev + 1, totalWithdrawPages))}
                disabled={withdrawPage === totalWithdrawPages}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* 提现对话框 */}
      {isWithdrawModalOpen && selectedAsset && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>提现资产: {selectedAsset.symbol}</h3>
              <button className="modal-close" onClick={closeWithdrawModal}>&times;</button>
            </div>
            <div className="modal-body">
              {withdrawSuccess && (
                <div className="form-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>{withdrawSuccess}</span>
                </div>
              )}
              <div className="input-group">
                <label htmlFor="withdraw-quantity">数量</label>
                <input 
                  id="withdraw-quantity"
                  type="number" 
                  placeholder="输入数量" 
                  className={`input ${withdrawErrors.quantity ? 'input-error' : ''}`}
                  value={withdrawQuantity}
                  onChange={(e) => setWithdrawQuantity(e.target.value)}
                />
                {withdrawErrors.quantity && (
                  <div className="error-message">{withdrawErrors.quantity}</div>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="withdraw-trade-url">Steam交易URL</label>
                <input 
                  id="withdraw-trade-url"
                  type="text" 
                  placeholder="输入Steam交易URL" 
                  className={`input ${withdrawErrors.tradeUrl ? 'input-error' : ''}`}
                  value={withdrawTradeUrl}
                  onChange={(e) => setWithdrawTradeUrl(e.target.value)}
                />
                {withdrawErrors.tradeUrl && (
                  <div className="error-message">{withdrawErrors.tradeUrl}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeWithdrawModal}>取消</button>
              <button className="btn btn-primary" onClick={handleWithdraw}>提交提现请求</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;