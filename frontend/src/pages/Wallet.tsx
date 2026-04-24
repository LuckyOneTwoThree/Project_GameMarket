import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

// 类型定义
interface Balances {
  usdt: number;
  usdc: number;
}

interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw' | 'trade';
  currency: 'USDT' | 'USDC';
  amount: number;
  status: 'completed' | 'pending';
  created_at: string;
}

const Wallet: React.FC = () => {
  // 钱包余额数据
  const [balances, setBalances] = useState<Balances>({
    usdt: 1000,
    usdc: 500
  });
  
  // 资金历史
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'deposit', currency: 'USDT', amount: 500, status: 'completed', created_at: new Date().toISOString() },
    { id: 2, type: 'withdraw', currency: 'USDT', amount: 200, status: 'completed', created_at: new Date().toISOString() },
    { id: 3, type: 'trade', currency: 'USDT', amount: 100, status: 'completed', created_at: new Date().toISOString() },
    { id: 4, type: 'deposit', currency: 'USDC', amount: 300, status: 'completed', created_at: new Date().toISOString() },
    { id: 5, type: 'withdraw', currency: 'USDC', amount: 100, status: 'pending', created_at: new Date().toISOString() }
  ]);
  
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  
  // 充值表单数据
  const [depositCurrency, setDepositCurrency] = useState<'USDT' | 'USDC'>('USDT');
  const [depositAmount, setDepositAmount] = useState<string>('');
  
  // 提现表单数据
  const [withdrawCurrency, setWithdrawCurrency] = useState<'USDT' | 'USDC'>('USDT');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  
  // 从后端API获取钱包数据
  const fetchWalletData = async () => {
    setLoading(true);
    try {
      // 获取钱包余额
      const balancesResponse = await apiService.wallet.getBalances();
      setBalances(balancesResponse);

      // 获取资金历史
      const transactionsResponse = await apiService.wallet.getTransactionHistory();
      // 后端返回的数据使用 timestamp 字段，需要映射到 Transaction 类型的 created_at 字段
      const mappedTransactions: Transaction[] = (transactionsResponse as any[]).map((item: any) => ({
        id: item.id,
        type: item.type,
        currency: item.currency,
        amount: item.amount,
        status: item.status,
        created_at: item.timestamp || item.created_at
      }));
      setTransactions(mappedTransactions);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      alert('获取钱包数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);
  
  // 验证充值表单
  const validateDepositForm = (): boolean => {
    if (!depositAmount || isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      alert('请输入有效的充值金额');
      return false;
    }
    return true;
  };
  
  // 验证提现表单
  const validateWithdrawForm = (): boolean => {
    if (!withdrawAmount || isNaN(parseFloat(withdrawAmount)) || parseFloat(withdrawAmount) <= 0) {
      alert('请输入有效的提现金额');
      return false;
    }
    
    if (!withdrawAddress) {
      alert('请输入提现地址');
      return false;
    }
    
    // 检查余额是否足够
    const balance = withdrawCurrency === 'USDT' ? (balances.usdt || 0) : (balances.usdc || 0);
    if (parseFloat(withdrawAmount) > balance) {
      alert('余额不足');
      return false;
    }
    
    return true;
  };
  
  // 处理充值
  const handleDeposit = async () => {
    if (!validateDepositForm()) return;
    
    setLoading(true);
    try {
      await apiService.wallet.deposit({
        currency: depositCurrency,
        amount: parseFloat(depositAmount)
      });
      alert('充值地址已生成，请查收');
      setDepositAmount('');
      
      // 重新获取钱包数据
      await fetchWalletData();
    } catch (error) {
      console.error('Error depositing:', error);
      alert('充值失败，请检查输入');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理提现
  const handleWithdraw = async () => {
    if (!validateWithdrawForm()) return;
    
    setLoading(true);
    try {
      await apiService.wallet.withdraw({
        currency: withdrawCurrency,
        amount: parseFloat(withdrawAmount),
        address: withdrawAddress
      });
      alert('提现申请已提交，正在处理');
      setWithdrawAmount('');
      setWithdrawAddress('');
      
      // 重新获取钱包数据
      await fetchWalletData();
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('提现失败，请检查输入');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="wallet">
      <div className="wallet-header">
        <h1 className="page-title">钱包管理</h1>
        <p className="page-subtitle">管理您的加密货币资金</p>
      </div>
      
      {/* 钱包余额 */}
      <div className="wallet-overview">
        <div className="balance-section">
          <div className="section-header">
            <h2 className="section-title-small">钱包余额</h2>
          </div>
          <div className="balance-grid">
            <div className="balance-item fade-in">
              <div className="balance-info">
                <div className="balance-icon usdt-icon">
                  <span className="currency-logo">USDT</span>
                </div>
                <div className="balance-details">
                  <div className="balance-symbol">USDT</div>
                  <div className="balance-amount">${balances.usdt ? balances.usdt.toLocaleString() : '0'}</div>
                </div>
              </div>
              <div className="balance-actions">
                <button className="btn btn-sm btn-primary">充值</button>
                <button className="btn btn-sm btn-outline">提现</button>
              </div>
            </div>
            <div className="balance-item fade-in">
              <div className="balance-info">
                <div className="balance-icon usdc-icon">
                  <span className="currency-logo">USDC</span>
                </div>
                <div className="balance-details">
                  <div className="balance-symbol">USDC</div>
                  <div className="balance-amount">${balances.usdc ? balances.usdc.toLocaleString() : '0'}</div>
                </div>
              </div>
              <div className="balance-actions">
                <button className="btn btn-sm btn-primary">充值</button>
                <button className="btn btn-sm btn-outline">提现</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 充值和提现 */}
      <div className="wallet-main">
        {/* 充值资金 */}
        <div className="wallet-left">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title-small">充值资金</h2>
            </div>
            <div className="deposit-form">
              <div className="input-group">
                <label>选择币种</label>
                <select 
                  className="select"
                  value={depositCurrency}
                  onChange={(e) => setDepositCurrency(e.target.value as 'USDT' | 'USDC')}
                >
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
              <div className="input-group">
                <label>金额</label>
                <input 
                  type="number" 
                  placeholder="输入金额" 
                  className="input"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0" 
                  step="0.01"
                />
              </div>
              <button 
                className="btn btn-primary btn-block"
                onClick={handleDeposit}
                disabled={loading}
              >
                {loading ? '处理中...' : '生成充值地址'}
              </button>
            </div>
          </div>
        </div>
        
        {/* 提现资金 */}
        <div className="wallet-right">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title-small">提现资金</h2>
            </div>
            <div className="withdraw-form">
              <div className="input-group">
                <label>选择币种</label>
                <select 
                  className="select"
                  value={withdrawCurrency}
                  onChange={(e) => setWithdrawCurrency(e.target.value as 'USDT' | 'USDC')}
                >
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
              <div className="input-group">
                <label>金额</label>
                <input 
                  type="number" 
                  placeholder="输入金额" 
                  className="input"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="0" 
                  step="0.01"
                />
              </div>
              <div className="input-group">
                <label>提现地址</label>
                <input 
                  type="text" 
                  placeholder="输入地址" 
                  className="input"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-danger btn-block"
                onClick={handleWithdraw}
                disabled={loading}
              >
                {loading ? '处理中...' : '提现'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 资金历史 */}
      <div className="wallet-history">
        <div className="card">
          <div className="section-header">
            <h2 className="section-title-small">资金历史</h2>
            <span className="section-badge">{transactions.length} 条记录</span>
          </div>
          <div className="history-table">
            <table className="table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>类型</th>
                  <th>币种</th>
                  <th>金额</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td>
                      <div className="time-info">
                        <span className="time-date">{new Date(transaction.created_at).toLocaleDateString()}</span>
                        <span className="time-time">{new Date(transaction.created_at).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`tag ${transaction.type === 'deposit' ? 'tag-success' : transaction.type === 'withdraw' ? 'tag-danger' : 'tag-info'}`}>
                        {transaction.type === 'deposit' ? '充值' : transaction.type === 'withdraw' ? '提现' : '交易'}
                      </span>
                    </td>
                    <td>{transaction.currency}</td>
                    <td className={transaction.type === 'deposit' ? 'inflow' : 'outflow'}>
                      {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount}
                    </td>
                    <td>
                      <span className={`tag ${transaction.status === 'completed' ? 'tag-success' : 'tag-warning'}`}>
                        {transaction.status === 'completed' ? '已完成' : '处理中'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;