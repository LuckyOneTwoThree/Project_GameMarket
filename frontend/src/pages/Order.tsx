import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Order: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'buy' | 'sell' | 'pending' | 'completed' | 'cancelled'>('all');

  // 获取用户订单列表
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.trade.getUserOrders();
      const ordersData = response.data || response;
      setOrders(ordersData);
    } catch (err) {
      setError('获取订单失败，请稍后重试');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // 取消订单
  const handleCancelOrder = async (orderId: number) => {
    try {
      await apiService.trade.cancelOrder(orderId);
      // 重新获取订单列表
      fetchOrders();
    } catch (err) {
      alert('取消订单失败，请稍后重试');
      console.error('Error cancelling order:', err);
    }
  };

  // 过滤订单
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'buy' && order.side === 'buy') return true;
    if (activeTab === 'sell' && order.side === 'sell') return true;
    if (activeTab === 'pending' && order.status === 'pending') return true;
    if (activeTab === 'completed' && order.status === 'completed') return true;
    if (activeTab === 'cancelled' && order.status === 'cancelled') return true;
    return false;
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="order-page">
      <div className="order-header">
        <h2>我的订单</h2>
        <div className="order-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            全部
          </button>
          <button
            className={`tab-btn ${activeTab === 'buy' ? 'active' : ''}`}
            onClick={() => setActiveTab('buy')}
          >
            买入
          </button>
          <button
            className={`tab-btn ${activeTab === 'sell' ? 'active' : ''}`}
            onClick={() => setActiveTab('sell')}
          >
            卖出
          </button>
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            待成交
          </button>
          <button
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            已成交
          </button>
          <button
            className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            已取消
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="order-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">暂无订单</div>
          ) : (
            <table className="order-table">
              <thead>
                <tr>
                  <th>订单ID</th>
                  <th>交易对</th>
                  <th>类型</th>
                  <th>价格</th>
                  <th>数量</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={`order-row ${order.status}`}>
                    <td>{order.id}</td>
                    <td>{order.symbol}</td>
                    <td>
                      <span className={`order-type ${order.side}`}>
                        {order.side === 'buy' ? '买入' : '卖出'}
                      </span>
                    </td>
                    <td>{order.price ? order.price.toFixed(2) : '0.00'} USDT</td>
                    <td>{order.quantity}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status === 'pending' ? '待成交' :
                         order.status === 'completed' ? '已成交' :
                         order.status === 'cancelled' ? '已取消' : order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at || Date.now()).toLocaleString()}</td>
                    <td>
                      {order.status === 'pending' && (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          取消
                        </button>
                      )}
                      <button
                        className="detail-btn"
                        onClick={() => {
                          // 查看订单详情
                          alert(`订单详情: ${order.id}`);
                        }}
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Order;