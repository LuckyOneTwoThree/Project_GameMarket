// 导入数据库模型
const { Asset, Sku } = require('../models');

// 导入共享存储
const storage = require('../storage');

// 使用共享存储
const wallets = storage.wallets;
const transactions = storage.transactions;
const skus = storage.skus;
const orders = storage.orders;
const trades = storage.trades;
let nextWalletId = storage.nextWalletId;
let nextTransactionId = storage.nextTransactionId;
let nextOrderId = storage.nextOrderId;
let nextTradeId = storage.nextTradeId;

// 初始化交易对数据（如果为空）
if (skus.length === 0) {
  const defaultSkus = [
    {
      id: 1,
      ticker: 'AKRED-FT-T1',
      display_name_cn: 'AK-47 | Redline (Field-Tested)',
      is_active: true
    },
    {
      id: 2,
      ticker: 'M4PRT-MW',
      display_name_cn: 'M4A4 | Printstream (Minimal Wear)',
      is_active: true
    },
    {
      id: 3,
      ticker: 'GLOVE-PAN-FT',
      display_name_cn: 'Sport Gloves | Pandora\'s Box (Field-Tested)',
      is_active: true
    },
    {
      id: 4,
      ticker: 'KARAM-DOP-P1',
      display_name_cn: 'Karambit | Doppler (Phase 1)',
      is_active: true
    },
    {
      id: 5,
      ticker: 'CASE-REV',
      display_name_cn: 'Spectrum 2 Case',
      is_active: true
    }
  ];
  
  defaultSkus.forEach(sku => skus.push(sku));
  storage.setNextSkuId(6);
}

// 简单的订单簿
const orderBooks = {
  'AKRED-FT-T1': {
    bids: [[99, 10], [98, 20], [97, 30], [96, 15], [95, 25]],
    asks: [[101, 15], [102, 25], [103, 35], [104, 20], [105, 10]]
  },
  'M4PRT-MW': {
    bids: [[199, 5], [198, 10], [197, 15], [196, 8], [195, 12]],
    asks: [[201, 8], [202, 12], [203, 15], [204, 10], [205, 5]]
  },
  'GLOVE-PAN-FT': {
    bids: [[999, 2], [998, 4], [997, 6], [996, 3], [995, 5]],
    asks: [[1001, 3], [1002, 5], [1003, 6], [1004, 4], [1005, 2]]
  },
  'KARAM-DOP-P1': {
    bids: [[1999, 1], [1998, 2], [1997, 3], [1996, 1], [1995, 2]],
    asks: [[2001, 1], [2002, 2], [2003, 3], [2004, 1], [2005, 2]]
  },
  'CASE-REV': {
    bids: [[2.99, 50], [2.98, 100], [2.97, 150], [2.96, 75], [2.95, 125]],
    asks: [[3.01, 75], [3.02, 125], [3.03, 150], [3.04, 100], [3.05, 50]]
  }
};

// 获取交易对列表
const getTrades = async (req, res) => {
  try {
    const trades = skus.map(sku => ({
      id: sku.id,
      symbol: sku.ticker,
      baseAsset: sku.display_name_cn,
      quoteAsset: 'USDT',
      lastPrice: 0,
      volume: 0
    }));
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取交易对详情
const getTradeDetail = async (req, res) => {
  try {
    const { symbol } = req.params;
    const sku = skus.find(sku => sku.ticker === symbol && sku.is_active);
    
    if (!sku) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    res.status(200).json({
      id: sku.id,
      symbol: sku.ticker,
      baseAsset: sku.display_name_cn,
      quoteAsset: 'USDT',
      lastPrice: 0,
      volume: 0,
      orderBook: orderBooks[symbol] || { bids: [], asks: [] }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取订单簿
const getOrderBook = async (req, res) => {
  try {
    const { symbol } = req.params;
    const sku = skus.find(sku => sku.ticker === symbol && sku.is_active);
    
    if (!sku) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    const orderBook = orderBooks[symbol] || { bids: [], asks: [] };
    res.status(200).json(orderBook);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取交易历史
const getTradeHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const sku = skus.find(sku => sku.ticker === symbol && sku.is_active);
    
    if (!sku) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    // 生成模拟交易历史
    const mockTrades = [
      { id: 1, price: 100, quantity: 5, side: 'buy', timestamp: new Date().toISOString() },
      { id: 2, price: 99.5, quantity: 3, side: 'sell', timestamp: new Date().toISOString() },
      { id: 3, price: 100, quantity: 2, side: 'buy', timestamp: new Date().toISOString() },
      { id: 4, price: 100.5, quantity: 4, side: 'buy', timestamp: new Date().toISOString() },
      { id: 5, price: 99, quantity: 6, side: 'sell', timestamp: new Date().toISOString() }
    ];
    
    res.status(200).json(mockTrades);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 创建订单
const createOrder = async (req, res) => {
  try {
    const { symbol, side, type, price, quantity } = req.body;
    const sku = skus.find(sku => sku.ticker === symbol && sku.is_active);
    
    if (!sku) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    // 验证价格和数量
    if (!price || price <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }
    
    // 计算交易金额
    const totalAmount = price * quantity;
    
    // 处理资金余额
    if (side === 'buy') {
      // 买入：扣除 USDT 余额
      let usdtWallet = wallets.find(w => w.user_id === req.user.id && w.currency === 'USDT');
      if (!usdtWallet) {
        // 为用户创建默认 USDT 钱包
        usdtWallet = {
          id: nextWalletId++,
          user_id: req.user.id,
          currency: 'USDT',
          balance: 10000 // 默认余额 10000 USDT
        };
        wallets.push(usdtWallet);
      }
      
      // 检查余额是否足够
      if (usdtWallet.balance < totalAmount) {
        return res.status(400).json({ error: 'Insufficient USDT balance' });
      }
      
      // 扣除余额
      usdtWallet.balance -= totalAmount;
      
      // 创建交易记录
      const transaction = {
        id: nextTransactionId++,
        user_id: req.user.id,
        type: 'trade',
        currency: 'USDT',
        amount: totalAmount,
        status: 'completed',
        description: `Buy ${quantity} ${symbol} at ${price} USDT`,
        created_at: new Date()
      };
      transactions.push(transaction);
    } else {
      // 卖出：增加 USDT 余额
      let usdtWallet = wallets.find(w => w.user_id === req.user.id && w.currency === 'USDT');
      if (!usdtWallet) {
        // 为用户创建默认 USDT 钱包
        usdtWallet = {
          id: nextWalletId++,
          user_id: req.user.id,
          currency: 'USDT',
          balance: 10000 // 默认余额 10000 USDT
        };
        wallets.push(usdtWallet);
      }
      
      // 增加余额
      usdtWallet.balance += totalAmount;
      
      // 创建交易记录
      const transaction = {
        id: nextTransactionId++,
        user_id: req.user.id,
        type: 'trade',
        currency: 'USDT',
        amount: totalAmount,
        status: 'completed',
        description: `Sell ${quantity} ${symbol} at ${price} USDT`,
        created_at: new Date()
      };
      transactions.push(transaction);
    }
    
    // 创建订单
    const order = {
      id: nextOrderId++,
      user_id: req.user.id,
      sku_id: sku.id,
      side,
      type,
      price,
      quantity,
      filled_quantity: 0,
      status: 'pending',
      created_at: new Date()
    };
    orders.push(order);
    
    // 模拟订单匹配 - 这里简化处理，直接认为订单成交
    const match = {
      buyOrderId: order.id,
      sellOrderId: order.id,
      price: price,
      quantity: quantity
    };
    
    // 创建成交记录
    const trade = {
      id: nextTradeId++,
      buy_order_id: match.buyOrderId,
      sell_order_id: match.sellOrderId,
      sku_id: sku.id,
      price: match.price,
      quantity: match.quantity,
      buyer_id: req.user.id,
      seller_id: req.user.id,
      status: 'completed',
      created_at: new Date()
    };
    trades.push(trade);
    
    // 更新订单状态为已成交
    order.status = 'completed';
    order.filled_quantity = quantity;
    
    // 更新用户资产
    if (side === 'buy') {
      // 买入：增加用户资产
      let userAsset = await Asset.findOne({
        where: { user_id: req.user.id, sku_id: sku.id }
      });
      
      if (!userAsset) {
        userAsset = await Asset.create({
          user_id: req.user.id,
          sku_id: sku.id,
          quantity: 0,
          status: 'available'
        });
      }
      
      await userAsset.update({ quantity: userAsset.quantity + quantity });
    } else {
      // 卖出：减少用户资产
      let userAsset = await Asset.findOne({
        where: { user_id: req.user.id, sku_id: sku.id }
      });
      
      if (userAsset) {
        await userAsset.update({ quantity: userAsset.quantity - quantity });
      }
    }
    
    res.status(201).json({
      id: order.id,
      symbol: sku.ticker,
      side: order.side,
      type: order.type,
      price: order.price,
      quantity: order.quantity,
      status: order.status
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取订单详情
const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const order = orders.find(order => order.id === parseInt(id) && order.user_id === req.user.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const sku = skus.find(sku => sku.id === order.sku_id);
    
    res.status(200).json({
      id: order.id,
      symbol: sku.ticker,
      side: order.side,
      type: order.type,
      price: order.price,
      quantity: order.quantity,
      filledQuantity: order.filled_quantity,
      status: order.status
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 取消订单
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = orders.find(order => order.id === parseInt(id) && order.user_id === req.user.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }
    
    // 取消订单
    order.status = 'cancelled';
    
    res.status(200).json({
      id: order.id,
      status: 'cancelled'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取用户订单列表
const getUserOrders = async (req, res) => {
  try {
    const userOrders = orders.filter(order => order.user_id === req.user.id);
    
    res.status(200).json(userOrders.map(order => {
      const sku = skus.find(sku => sku.id === order.sku_id);
      return {
        id: order.id,
        symbol: sku.ticker,
        side: order.side,
        type: order.type,
        price: order.price,
        quantity: order.quantity,
        status: order.status,
        created_at: order.created_at
      };
    }));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取价格图表数据
const getPriceChartData = async (req, res) => {
  try {
    const { symbol, timeframe } = req.params;
    const sku = skus.find(sku => sku.ticker === symbol && sku.is_active);
    
    if (!sku) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    // 生成模拟图表数据
    const chartData = [];
    const now = new Date();
    
    for (let i = 60; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 1000);
      chartData.push({
        time: time.getTime(),
        open: 100 + Math.random() * 10,
        high: 105 + Math.random() * 5,
        low: 95 + Math.random() * 5,
        close: 100 + Math.random() * 10,
        volume: Math.floor(Math.random() * 100)
      });
    }
    
    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getTrades,
  getTradeDetail,
  getOrderBook,
  getTradeHistory,
  createOrder,
  getOrderDetail,
  cancelOrder,
  getUserOrders,
  getPriceChartData
};
