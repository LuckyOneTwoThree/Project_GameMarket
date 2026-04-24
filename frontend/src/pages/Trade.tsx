import React, { useState, useEffect } from 'react';
import CustomDropdown from '../components/CustomDropdown';
import { apiService } from '../services/api';

const Trade: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AKRED-FT-T1');
  const [symbols, setSymbols] = useState([
    {
      value: 'AKRED-FT-T1',
      label: 'AK-47 | Redline (Field-Tested)',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20AK-47%20Redline%20Field%20Tested%20skin%20preview&image_size=square'
    },
    {
      value: 'M4PRT-MW',
      label: 'M4A4 | Printstream (Minimal Wear)',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20M4A4%20Printstream%20Minimal%20Wear%20skin%20preview&image_size=square'
    },
    {
      value: 'GLOVE-PAN-FT',
      label: 'Sport Gloves | Pandora\'s Box (Field-Tested)',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20Sport%20Gloves%20Pandoras%20Box%20Field%20Tested%20skin%20preview&image_size=square'
    },
    {
      value: 'KARAM-DOP-P1',
      label: 'Karambit | Doppler (Phase 1)',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20Karambit%20Doppler%20Phase%201%20skin%20preview&image_size=square'
    },
    {
      value: 'CASE-REV',
      label: 'Spectrum 2 Case',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20Spectrum%202%20Case%20preview&image_size=square'
    }
  ]);
  
  const [orderBook, setOrderBook] = useState({
    bids: [[99, 10], [98, 20], [97, 30], [96, 15], [95, 25]],
    asks: [[101, 15], [102, 25], [103, 35], [104, 20], [105, 10]]
  });
  
  const [tradeHistory, setTradeHistory] = useState([
    { id: 1, price: 100, quantity: 5, side: 'buy', timestamp: new Date().toISOString() },
    { id: 2, price: 99.5, quantity: 3, side: 'sell', timestamp: new Date().toISOString() },
    { id: 3, price: 100, quantity: 2, side: 'buy', timestamp: new Date().toISOString() },
    { id: 4, price: 100.5, quantity: 4, side: 'buy', timestamp: new Date().toISOString() },
    { id: 5, price: 99, quantity: 6, side: 'sell', timestamp: new Date().toISOString() }
  ]);
  
  const [currentPrice, setCurrentPrice] = useState(100);
  const [priceChange, setPriceChange] = useState(2.5);
  const [priceChangePercent, setPriceChangePercent] = useState(2.56);

  
  const [buyPrice, setBuyPrice] = useState('');
  const [buyQuantity, setBuyQuantity] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  
  const [priceChartData, setPriceChartData] = useState<number[]>([]);
  const [usdtBalance, setUsdtBalance] = useState<number>(10000); // 默认余额，后续从后端获取
  const [assetBalances, setAssetBalances] = useState<{[key: string]: number}>({}); // 资产余额，后续从后端获取
  
  useEffect(() => {
    const generatePriceData = () => {
      const data: number[] = [];
      let price = currentPrice;
      
      for (let i = 0; i < 60; i++) {
        const change = (Math.random() - 0.5) * 2;
        price += change;
        data.push(price);
      }
      
      setPriceChartData(data);
    };
    
    generatePriceData();
    const interval = setInterval(generatePriceData, 3000);
    return () => clearInterval(interval);
  }, [currentPrice]);
  
  useEffect(() => {
    // 从后端API获取交易数据
    const fetchTradeData = async () => {
      try {
        // 获取交易对列表
        const tradesData = await apiService.trade.getTrades();
        if (tradesData && Array.isArray(tradesData) && tradesData.length > 0) {
          const newSymbols = tradesData.map((trade: any) => ({
            value: trade.symbol,
            label: trade.baseAsset,
            icon: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20${trade.symbol}%20skin%20preview&image_size=square`
          }));
          setSymbols(newSymbols);
        }

        // 获取订单簿数据
        const orderBookData = await apiService.trade.getOrderBook(selectedSymbol);
        setOrderBook(orderBookData.data || orderBookData);

        // 获取交易历史数据
        const tradeHistoryData = await apiService.trade.getTradeHistory(selectedSymbol);
        setTradeHistory(tradeHistoryData.data || tradeHistoryData);

        // 获取交易对详情
        const tradeDetailData = await apiService.trade.getTradeDetail(selectedSymbol);
        if (tradeDetailData.data && tradeDetailData.data.lastPrice) {
          setCurrentPrice(tradeDetailData.data.lastPrice);
          // 这里可以计算涨跌幅，需要从后端获取更多数据
        }

        // 获取用户余额
        const balancesData = await apiService.wallet.getBalances();
        if (balancesData.usdt) {
          setUsdtBalance(balancesData.usdt);
        }

        // 获取用户资产
        const assetsData = await apiService.asset.getAssets();
        const assetMap: {[key: string]: number} = {};
        (assetsData.data || assetsData).forEach((asset: any) => {
          assetMap[asset.symbol] = asset.quantity;
        });
        setAssetBalances(assetMap);
      } catch (error) {
        console.error('Error fetching trade data:', error);
      }
    };

    fetchTradeData();

    // 定期更新价格
    const updatePrice = () => {
      const change = (Math.random() - 0.5) * 0.5;
      setCurrentPrice(prev => {
        const newPrice = prev + change;
        setPriceChange(newPrice - 100);
        setPriceChangePercent(((newPrice - 100) / 100) * 100);
        return newPrice;
      });
    };
    
    const interval = setInterval(updatePrice, 2000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);
  
  const calculateTotalQuantity = (orders: number[][]) => {
    return orders ? orders.reduce((total, [, quantity]) => total + quantity, 0) : 0;
  };
  
  const totalBidQuantity = calculateTotalQuantity(orderBook?.bids || []);
  const totalAskQuantity = calculateTotalQuantity(orderBook?.asks || []);
  
  const handlePriceClick = (price: number, side: 'buy' | 'sell') => {
    if (side === 'buy') {
      setBuyPrice(price.toString());
    } else {
      setSellPrice(price.toString());
    }
  };
  
  const handleQuickPrice = (type: string) => {
    switch (type) {
      case 'last':
        setBuyPrice(currentPrice.toFixed(2));
        setSellPrice(currentPrice.toFixed(2));
        break;
      case 'bid':
        if (orderBook?.bids && orderBook.bids.length > 0) {
          setBuyPrice(orderBook.bids[0][0].toString());
        }
        break;
      case 'ask':
        if (orderBook?.asks && orderBook.asks.length > 0) {
          setSellPrice(orderBook.asks[0][0].toString());
        }
        break;
      default:
        break;
    }
  };
  
  const handleQuantityPercent = (percent: number, side: 'buy' | 'sell') => {
    const availableBalance = usdtBalance;
    const availableAsset = assetBalances[selectedSymbol] || 0;
    
    if (side === 'buy') {
      const price = buyPrice ? parseFloat(buyPrice) : currentPrice;
      if (price > 0) {
        const maxQuantity = availableBalance / price;
        const quantity = (maxQuantity * percent) / 100;
        setBuyQuantity(quantity.toFixed(4));
      }
    } else {
      const quantity = (availableAsset * percent) / 100;
      setSellQuantity(quantity.toFixed(4));
    }
  };
  
  return (
    <div className="trade">
      <div className="trade-header-bar">
        <div className="trade-header-container">
          <div className="symbol-section">
            <div className="symbol-select-wrapper">
              <CustomDropdown
                options={symbols}
                value={selectedSymbol}
                onChange={setSelectedSymbol}
                className="symbol-dropdown"
              />
            </div>
          </div>
          
          <div className="price-info-section">
            <div className="price-main">
              <span className="current-price">{currentPrice.toFixed(2)}</span>
              <span className="price-currency">USDT</span>
            </div>
            <div className="price-change-section">
              <div className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                <span className="change-label">24h</span>
                <span className="change-value">{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}</span>
              </div>
              <div className={`percent-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                <span className="change-value">{priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%</span>
              </div>
            </div>
          </div>
          
          <div className="market-stats-section">
            <div className="stat-item">
              <div className="stat-title">24h最高</div>
              <div className="stat-number">105.00</div>
            </div>
            <div className="stat-item">
              <div className="stat-title">24h最低</div>
              <div className="stat-number">95.00</div>
            </div>
            <div className="stat-item">
              <div className="stat-title">24h成交量</div>
              <div className="stat-number">1,250</div>
            </div>
            <div className="stat-item">
              <div className="stat-title">实时深度</div>
              <div className="stat-number">{orderBook?.bids?.length || 0 + orderBook?.asks?.length || 0}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="trade-main">
        <div className="trade-left">
          <div className="card price-chart-card">
            <div className="chart-controls">
              <div className="chart-tabs">
                <button className="chart-tab active">走势图</button>
                <button className="chart-tab">K线图</button>
              </div>
              <div className="timeframe-selector">
                <button className="timeframe-btn active">1m</button>
                <button className="timeframe-btn">5m</button>
                <button className="timeframe-btn">15m</button>
                <button className="timeframe-btn">1h</button>
                <button className="timeframe-btn">4h</button>
                <button className="timeframe-btn">1d</button>
              </div>
            </div>
            <div className="chart-area">
              <div className="price-axis">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="price-label">
                    {(105 - i * 2.5).toFixed(1)}
                  </span>
                ))}
              </div>
              <div className="chart-canvas">
                <svg width="100%" height="200" viewBox="0 0 800 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="priceGradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(0, 196, 140, 0.3)" />
                      <stop offset="100%" stopColor="rgba(0, 196, 140, 0)" />
                    </linearGradient>
                    <linearGradient id="priceGradientRed" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(245, 34, 45, 0.3)" />
                      <stop offset="100%" stopColor="rgba(245, 34, 45, 0)" />
                    </linearGradient>
                  </defs>
                  <path 
                    d={(() => {
                      if (priceChartData.length === 0) return '';
                      const points = priceChartData.map((price, index) => {
                        const x = (index / (priceChartData.length - 1)) * 800;
                        const y = 200 - ((price - 90) / 20) * 180;
                        return `${x},${Math.max(10, Math.min(190, y))}`;
                      });
                      return `M ${points.join(' L ')}`;
                    })()}
                    fill="none"
                    stroke="var(--success-color)"
                    strokeWidth="2"
                    className="price-line"
                  />
                  <path 
                    d={(() => {
                      if (priceChartData.length === 0) return '';
                      const points = priceChartData.map((price, index) => {
                        const x = (index / (priceChartData.length - 1)) * 800;
                        const y = 200 - ((price - 90) / 20) * 180;
                        return `${x},${Math.max(10, Math.min(190, y))}`;
                      });
                      return `M ${points[0]} ${points.join(' L ')} L 800,200 L 0,200 Z`;
                    })()}
                    fill="url(#priceGradientGreen)"
                    className="price-area"
                  />
                </svg>
                <div className="chart-overlay">
                  <div className="crosshair-h"></div>
                  <div className="crosshair-v"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card trade-history-card">
            <div className="history-header-bar">
              <h3 className="section-title-small">实时成交</h3>
              <div className="history-filters">
                <button className="filter-btn active">全部</button>
                <button className="filter-btn">买入</button>
                <button className="filter-btn">卖出</button>
              </div>
            </div>
            <div className="history-list">
              {tradeHistory && tradeHistory.map((trade, index) => (
                <div key={trade.id} className={`history-item ${trade.side === 'buy' ? 'buy' : 'sell'}`} style={{animationDelay: `${index * 50}ms`}}>
                  <span className="history-price">{trade.price.toFixed(2)}</span>
                  <span className="history-quantity">{trade.quantity}</span>
                  <span className="history-time">{trade.timestamp ? new Date(trade.timestamp).toLocaleTimeString() : ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="trade-center">
          <div className="card order-book-card">
            <h3 className="section-title-small">订单簿</h3>
            <div className="order-book-header-row">
              <span>价格 (USDT)</span>
              <span>数量</span>
              <span>累计</span>
            </div>
            <div className="asks-section">
              {orderBook?.asks && [...orderBook.asks].reverse().map(([price, quantity], index) => {
                const cumulativeQuantity = orderBook.asks ? [...orderBook.asks].reverse().slice(0, index + 1).reduce((total, [, q]) => total + q, 0) : 0;
                const depthPercentage = totalAskQuantity > 0 ? (cumulativeQuantity / totalAskQuantity) * 100 : 0;
                return (
                  <div 
                    key={`ask-${index}`} 
                    className="order-book-row ask"
                    onClick={() => handlePriceClick(price, 'sell')}
                  >
                    <div className="depth-visual ask-depth" style={{width: `${depthPercentage}%`}}></div>
                    <span className="row-price">{price.toFixed(2)}</span>
                    <span className="row-quantity">{quantity}</span>
                    <span className="row-cumulative">{cumulativeQuantity}</span>
                  </div>
                );
              })}
            </div>
            <div className="market-price-row">
              <span className="market-price-label">市场最新价</span>
              <span className="market-price-value">{currentPrice.toFixed(2)}</span>
            </div>
            <div className="bids-section">
              {orderBook?.bids && orderBook.bids.map(([price, quantity], index) => {
                const cumulativeQuantity = orderBook.bids ? orderBook.bids.slice(0, index + 1).reduce((total, [, q]) => total + q, 0) : 0;
                const depthPercentage = totalBidQuantity > 0 ? (cumulativeQuantity / totalBidQuantity) * 100 : 0;
                return (
                  <div 
                    key={`bid-${index}`} 
                    className="order-book-row bid"
                    onClick={() => handlePriceClick(price, 'buy')}
                  >
                    <div className="depth-visual bid-depth" style={{width: `${depthPercentage}%`}}></div>
                    <span className="row-price">{price.toFixed(2)}</span>
                    <span className="row-quantity">{quantity}</span>
                    <span className="row-cumulative">{cumulativeQuantity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="trade-right">
          <div className="card trade-form-card">
            <div className="trade-type-tabs">
              <button
                className={`trade-type-tab ${activeTab === 'buy' ? 'active buy' : ''}`}
                onClick={() => setActiveTab('buy')}
              >
                买入
              </button>
              <button
                className={`trade-type-tab ${activeTab === 'sell' ? 'active sell' : ''}`}
                onClick={() => setActiveTab('sell')}
              >
                卖出
              </button>
            </div>

            <div className="order-type-selector">
              <button
                className={`order-type-btn ${orderType === 'limit' ? 'active' : ''}`}
                onClick={() => setOrderType('limit')}
              >
                限价
              </button>
              <button
                className={`order-type-btn ${orderType === 'market' ? 'active' : ''}`}
                onClick={() => setOrderType('market')}
              >
                市价
              </button>
            </div>

            {orderType === 'limit' && (
              <div className="input-group">
                <label>{activeTab === 'buy' ? '买入' : '卖出'}价格</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="input price-input"
                    value={activeTab === 'buy' ? buyPrice : sellPrice}
                    onChange={(e) => activeTab === 'buy' ? setBuyPrice(e.target.value) : setSellPrice(e.target.value)}
                  />
                  <span className="input-suffix-text">USDT</span>
                </div>
                <div className="quick-price-row">
                  <button className="quick-price-btn" onClick={() => handleQuickPrice('last')}>最新</button>
                  <button className="quick-price-btn" onClick={() => handleQuickPrice('bid')}>买一</button>
                  <button className="quick-price-btn" onClick={() => handleQuickPrice('ask')}>卖一</button>
                </div>
              </div>
            )}

            <div className="input-group">
              <label>{activeTab === 'buy' ? '买入' : '卖出'}数量</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  placeholder="0"
                  className="input quantity-input"
                  value={activeTab === 'buy' ? buyQuantity : sellQuantity}
                  onChange={(e) => activeTab === 'buy' ? setBuyQuantity(e.target.value) : setSellQuantity(e.target.value)}
                />
                <span className="input-suffix-text">{selectedSymbol}</span>
              </div>
              <div className="quantity-percent-row">
                <button className="percent-btn" onClick={() => handleQuantityPercent(25, activeTab)}>25%</button>
                <button className="percent-btn" onClick={() => handleQuantityPercent(50, activeTab)}>50%</button>
                <button className="percent-btn" onClick={() => handleQuantityPercent(75, activeTab)}>75%</button>
                <button className="percent-btn" onClick={() => handleQuantityPercent(100, activeTab)}>100%</button>
              </div>
            </div>

            <div className="trade-summary">
              <div className="summary-row">
                <span>{activeTab === 'buy' ? '买入' : '卖出'}总额</span>
                <span className="summary-value">
                  {(() => {
                    const price = orderType === 'market' ? currentPrice : parseFloat((activeTab === 'buy' ? buyPrice : sellPrice) || '0');
                    const quantity = parseFloat((activeTab === 'buy' ? buyQuantity : sellQuantity) || '0');
                    return (price * quantity).toFixed(2);
                  })()} USDT
                </span>
              </div>
              <div className="summary-row">
                <span>{activeTab === 'buy' ? '可用余额' : '可用资产'}</span>
                <span>{activeTab === 'buy' ? `${usdtBalance.toLocaleString()} USDT` : `${assetBalances[selectedSymbol] ? assetBalances[selectedSymbol].toLocaleString() : '0.00'} ${selectedSymbol}`}</span>
              </div>
            </div>

            <button 
              className={`btn btn-lg btn-block trade-submit-btn ${activeTab === 'buy' ? 'btn-success' : 'btn-danger'}`}
              onClick={async () => {
                try {
                  // 对于市价订单，使用当前市场价格
                  let price;
                  if (orderType === 'market') {
                    price = currentPrice;
                  } else {
                    price = parseFloat(activeTab === 'buy' ? buyPrice : sellPrice);
                    if (isNaN(price) || price <= 0) {
                      alert('请输入有效的价格（大于0）');
                      return;
                    }
                  }
                  
                  const quantity = parseFloat(activeTab === 'buy' ? buyQuantity : sellQuantity);
                  if (isNaN(quantity) || quantity <= 0) {
                    alert('请输入有效的数量（大于0）');
                    return;
                  }
                  
                  // 对于卖出操作，检查数量是否超过可用资产
                  if (activeTab === 'sell') {
                    const availableAsset = assetBalances[selectedSymbol] || 0;
                    if (quantity > availableAsset) {
                      alert('卖出数量不能超过可用资产');
                      return;
                    }
                  }
                  
                  const orderData = {
                    symbol: selectedSymbol,
                    side: activeTab,
                    type: orderType,
                    price: price,
                    quantity: quantity
                  };
                  
                  await apiService.trade.createOrder(orderData);
                  alert('订单创建成功');
                  
                  // 重置表单
                  if (activeTab === 'buy') {
                    setBuyPrice('');
                    setBuyQuantity('');
                  } else {
                    setSellPrice('');
                    setSellQuantity('');
                  }
                  
                  // 重新获取订单簿数据
                  const orderBookData = await apiService.trade.getOrderBook(selectedSymbol);
                  setOrderBook(orderBookData.data || orderBookData);
                  
                  // 重新获取用户余额
                  const balancesData = await apiService.wallet.getBalances();
                  if (balancesData.usdt) {
                    setUsdtBalance(balancesData.usdt);
                  }
                  
                  // 重新获取用户资产
                  const assetsData = await apiService.asset.getAssets();
                  const assetMap: {[key: string]: number} = {};
                  (assetsData.data || assetsData).forEach((asset: any) => {
                    assetMap[asset.symbol] = asset.quantity;
                  });
                  setAssetBalances(assetMap);
                } catch (error) {
                  console.error('Error creating order:', error);
                  alert('订单创建失败，请检查输入');
                }
              }}
            >
              {activeTab === 'buy' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              )}
              {activeTab === 'buy' ? '买入' : '卖出'} {selectedSymbol}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;