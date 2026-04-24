// 内存存储数据

// 钱包数据
const wallets = [];
const transactions = [];
let nextWalletId = 1;
let nextTransactionId = 1;

// 交易数据
const skus = [];
const orders = [];
const trades = [];
let nextSkuId = 1;
let nextOrderId = 1;
let nextTradeId = 1;

module.exports = {
  // 钱包相关
  wallets,
  transactions,
  nextWalletId,
  nextTransactionId,
  
  // 交易相关
  skus,
  orders,
  trades,
  nextSkuId,
  nextOrderId,
  nextTradeId,
  
  // 更新计数器
  setNextWalletId: (id) => { nextWalletId = id; },
  setNextTransactionId: (id) => { nextTransactionId = id; },
  setNextSkuId: (id) => { nextSkuId = id; },
  setNextOrderId: (id) => { nextOrderId = id; },
  setNextTradeId: (id) => { nextTradeId = id; }
};
