import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器，添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 未授权，清除token并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API接口
export const apiService = {
  // 用户相关
  auth: {
    login: (data: { email: string; password: string; isAdmin?: boolean }) => api.post('/api/users/login', data),
    register: (data: { email: string; password: string }) => api.post('/api/users/register', data),
    getProfile: () => api.get('/api/users/profile'),
    updateProfile: (data: { username?: string; email?: string; steam_id?: string; trade_url?: string }) => api.put('/api/users/profile', data),
    updatePassword: (data: { oldPassword: string; newPassword: string }) => api.put('/api/users/password', data),
    linkSteam: (data: { steam_id: string; trade_url: string }) => api.post('/api/users/steam/link', data),
    getSteamStatus: () => api.get('/api/users/steam/status')
  },

  // 交易相关
  trade: {
    getTrades: () => api.get('/api/trades'),
    getTradeDetail: (symbol: string) => api.get(`/api/trades/${symbol}`),
    getOrderBook: (symbol: string) => api.get(`/api/trades/${symbol}/orders`),
    getTradeHistory: (symbol: string) => api.get(`/api/trades/${symbol}/trades`),
    createOrder: (data: { symbol: string; side: string; type: string; price: number; quantity: number }) => api.post('/api/trades/orders', data),
    getOrderDetail: (id: number) => api.get(`/api/trades/orders/${id}`),
    cancelOrder: (id: number) => api.delete(`/api/trades/orders/${id}`),
    getUserOrders: () => api.get('/api/trades/orders'),
    getPriceChartData: (symbol: string, timeframe: string) => api.get(`/api/trades/${symbol}/chart/${timeframe}`)
  },

  // 资产相关
  asset: {
    getAssets: () => api.get('/api/assets'),
    depositAsset: (data: { assetId: string; quantity: number }) => api.post('/api/assets/deposit', data),
    withdrawAsset: (data: { symbol: string; quantity: number; tradeUrl: string }) => api.post('/api/assets/withdraw', data),
    getDepositHistory: () => api.get('/api/assets/deposit/history'),
    getWithdrawHistory: () => api.get('/api/assets/withdraw/history'),
    getDepositStatus: (id: number) => api.get(`/api/assets/deposit/${id}/status`),
    getWithdrawStatus: (id: number) => api.get(`/api/assets/withdraw/${id}/status`)
  },

  // 钱包相关
  wallet: {
    getBalances: (): Promise<{ usdt: number; usdc: number }> => api.get('/api/wallets'),
    deposit: (data: { currency: string; amount: number }) => api.post('/api/wallets/deposit', data),
    withdraw: (data: { currency: string; amount: number; address: string }) => api.post('/api/wallets/withdraw', data),
    getTransactionHistory: (): Promise<Array<{ id: number; type: string; currency: string; amount: number; status: string; timestamp: string }>> => api.get('/api/wallets/history')
  },

  // 通知设置相关
  notification: {
    getSettings: () => api.get('/api/notifications'),
    updateSettings: (data: { trade_notifications?: boolean; security_notifications?: boolean; market_notifications?: boolean }) => api.put('/api/notifications', data)
  },

  // 市场数据相关
  market: {
    getOverview: () => api.get('/api/market/overview'),
    getPopularAssets: () => api.get('/api/market/popular'),
    getLatestTrades: () => api.get('/api/market/trades')
  },

  // 管理员相关
  admin: {
    getProfile: () => api.get('/api/admin/profile'),
    getUsers: () => api.get('/api/admin/users'),
    getSkus: () => api.get('/api/admin/skus'),
    createSku: (data: any) => api.post('/api/admin/skus', data),
    updateSku: (id: number, data: any) => api.put(`/api/admin/skus/${id}`, data),
    deleteSku: (id: number) => api.delete(`/api/admin/skus/${id}`),
    getSystemStatus: () => api.get('/api/admin/status')
  }
};

export default api;
