// 导入共享存储
const storage = require('../storage');

// 使用共享存储
const wallets = storage.wallets;
const transactions = storage.transactions;
let nextWalletId = storage.nextWalletId;
let nextTransactionId = storage.nextTransactionId;

// 获取钱包余额
const getBalances = async (req, res) => {
  try {
    // 生成模拟钱包数据
    let userWallets = wallets.filter(wallet => wallet.user_id === req.user.id);
    
    if (userWallets.length === 0) {
      // 为新用户生成默认钱包
      const defaultCurrencies = ['USDT', 'USDC'];
      defaultCurrencies.forEach(currency => {
        wallets.push({
          id: nextWalletId++,
          user_id: req.user.id,
          currency,
          balance: 10000 // 默认余额10000
        });
      });
    }
    
    userWallets = wallets.filter(wallet => wallet.user_id === req.user.id);
    
    const balances = {};
    userWallets.forEach(wallet => {
      balances[wallet.currency.toLowerCase()] = wallet.balance;
    });
    
    res.status(200).json(balances);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 充值资金
const deposit = async (req, res) => {
  try {
    const { currency, amount } = req.body;
    
    // 查找或创建钱包
    let wallet = wallets.find(w => w.user_id === req.user.id && w.currency === currency);
    if (!wallet) {
      wallet = {
        id: nextWalletId++,
        user_id: req.user.id,
        currency,
        balance: 0
      };
      wallets.push(wallet);
    }
    
    // 增加余额
    wallet.balance += amount;
    
    // 创建交易记录
    const transaction = {
      id: nextTransactionId++,
      user_id: req.user.id,
      type: 'deposit',
      currency,
      amount,
      status: 'completed',
      created_at: new Date()
    };
    transactions.push(transaction);
    
    res.status(200).json({ success: true, balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 提现资金
const withdraw = async (req, res) => {
  try {
    const { currency, amount, address } = req.body;
    
    // 查找钱包
    const wallet = wallets.find(w => w.user_id === req.user.id && w.currency === currency);
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet not found' });
    }
    
    // 检查余额
    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // 减少余额
    wallet.balance -= amount;
    
    // 创建交易记录
    const transaction = {
      id: nextTransactionId++,
      user_id: req.user.id,
      type: 'withdraw',
      currency,
      amount,
      status: 'pending',
      address,
      created_at: new Date()
    };
    transactions.push(transaction);
    
    res.status(200).json({ success: true, balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取资金历史记录
const getTransactionHistory = async (req, res) => {
  try {
    const userTransactions = transactions.filter(transaction => transaction.user_id === req.user.id);
    
    // 生成模拟交易历史
    if (userTransactions.length === 0) {
      const mockTransactions = [
        {
          id: nextTransactionId++,
          user_id: req.user.id,
          type: 'deposit',
          currency: 'USDT',
          amount: 5000,
          status: 'completed',
          created_at: new Date(Date.now() - 86400000 * 7)
        },
        {
          id: nextTransactionId++,
          user_id: req.user.id,
          type: 'withdraw',
          currency: 'USDC',
          amount: 1000,
          status: 'completed',
          created_at: new Date(Date.now() - 86400000 * 3)
        }
      ];
      mockTransactions.forEach(tx => transactions.push(tx));
    }
    
    const updatedUserTransactions = transactions.filter(transaction => transaction.user_id === req.user.id);
    
    res.status(200).json(updatedUserTransactions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getBalances,
  deposit,
  withdraw,
  getTransactionHistory
};