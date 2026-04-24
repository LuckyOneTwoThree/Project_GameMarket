import React, { useEffect } from 'react';

const Home: React.FC = () => {
  // 模拟最新交易数据
  const recentTrades = [
    { id: 1, symbol: 'AKRED-FT-T1', price: 99.5, quantity: 2, time: '2分钟前' },
    { id: 2, symbol: 'M4PRT-MW', price: 120.3, quantity: 1, time: '5分钟前' },
    { id: 3, symbol: 'GLOVE-PAN-FT', price: 250.8, quantity: 1, time: '10分钟前' },
    { id: 4, symbol: 'KARAM-DOP-P1', price: 85.2, quantity: 3, time: '15分钟前' },
  ];

  // 模拟热门资产数据
  const popularAssets = [
    { id: 1, symbol: 'AKRED-FT-T1', price: 99.5, change: 2.5, volume: 1200 },
    { id: 2, symbol: 'M4PRT-MW', price: 120.3, change: -1.2, volume: 850 },
    { id: 3, symbol: 'GLOVE-PAN-FT', price: 250.8, change: 5.3, volume: 620 },
    { id: 4, symbol: 'KARAM-DOP-P1', price: 85.2, change: 0.8, volume: 980 },
  ];

  // 滚动动画效果
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-on-scroll');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
          (element as HTMLElement).style.opacity = '1';
          (element as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home">
      {/* 英雄区 */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-particles"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge pulse">全新上线</div>
          <h1 className="hero-title">Game Market</h1>
          <p className="hero-subtitle">专业的游戏饰品交易平台</p>
          <p className="hero-description">
            提供安全、高效的游戏饰品交易服务，毫秒级撮合，分钟级交付，
            让您的交易更加快捷、安全。
          </p>
          <div className="hero-buttons">
            <a href="/trade" className="btn btn-primary btn-lg hover-lift">开始交易</a>
            <a href="/assets" className="btn btn-outline btn-lg hover-lift">查看资产</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item fade-in">
              <span className="stat-value">10,000+</span>
              <span className="stat-label">活跃用户</span>
            </div>
            <div className="stat-item fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="stat-value">$10M+</span>
              <span className="stat-label">日交易量</span>
            </div>
            <div className="stat-item fade-in" style={{ animationDelay: '0.4s' }}>
              <span className="stat-value">99.9%</span>
              <span className="stat-label">系统可用性</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-container hover-scale">
            <img 
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Game Market" 
              className="hero-img"
            />
            <div className="hero-image-overlay"></div>
            <div className="hero-image-glow"></div>
          </div>
        </div>
      </section>

      {/* 市场概览 */}
      <section className="market-overview">
        <div className="card fade-in-on-scroll market-card">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <h2 className="section-title" style={{ textAlign: 'center', margin: '0' }}>市场概览</h2>
            <span className="section-badge" style={{ position: 'absolute', right: '0' }}>实时数据</span>
          </div>
          <div className="market-stats">
            <div className="market-stat-card hover-lift">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3>总交易量 (24h)</h3>
              <p className="market-stat-value">$12,543,210</p>
              <p className="market-stat-change positive">+12.5%</p>
            </div>
            <div className="market-stat-card hover-lift">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h3>活跃交易对</h3>
              <p className="market-stat-value">48</p>
              <p className="market-stat-change positive">+2</p>
            </div>
            <div className="market-stat-card hover-lift">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10"/>
                  <path d="M12 20V4"/>
                  <path d="M6 20v-6"/>
                </svg>
              </div>
              <h3>24h最高价格</h3>
              <p className="market-stat-value">$2,450.00</p>
              <p className="market-stat-change">GLOVE-PAN-FT</p>
            </div>
            <div className="market-stat-card hover-lift">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 4V20"/>
                  <path d="M12 4v16"/>
                  <path d="M6 10v10"/>
                </svg>
              </div>
              <h3>24h最低价格</h3>
              <p className="market-stat-value">$12.50</p>
              <p className="market-stat-change">CASE-REV</p>
            </div>
          </div>
        </div>
      </section>

      {/* 热门资产 */}
      <section className="popular-assets">
        <div className="card fade-in-on-scroll market-card">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <h2 className="section-title" style={{ textAlign: 'center', margin: '0' }}>热门资产</h2>
            <a href="/trade" className="view-all-link" style={{ position: 'absolute', right: '0' }}>查看全部</a>
          </div>
          <div className="assets-grid">
          {popularAssets.map((asset, index) => (
            <div key={asset.id} className="asset-card hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="asset-icon">
                <img 
                  src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSGO%20skin%20${asset.symbol}%20weapon%20skin%20preview&image_size=square`} 
                  alt={asset.symbol} 
                  className="asset-icon-image"
                />
              </div>
              <div className="asset-badge">
                <span className={`badge-icon ${asset.change >= 0 ? 'positive' : 'negative'}`}>
                  {asset.change >= 0 ? '↑' : '↓'}
                </span>
                <span className={`badge-change ${asset.change >= 0 ? 'positive' : 'negative'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                </span>
              </div>
              <div className="asset-header">
                <h3 className="asset-symbol">{asset.symbol}</h3>
              </div>
              <div className="asset-price">${asset.price}</div>
              <div className="asset-volume">
                <span className="volume-label">24h 交易量:</span>
                <span className="volume-value">${asset.volume}</span>
              </div>
              <a href="/trade" className="btn btn-outline btn-sm asset-button hover-fill">交易</a>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="features">
        <div className="card fade-in-on-scroll market-card">
          <div className="section-header" style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>核心优势</h2>
            <p className="section-description" style={{ textAlign: 'center', margin: '0' }}>我们提供行业领先的游戏饰品交易服务</p>
          </div>
          <div className="features-grid">
          <div className="feature-card fade-in-on-scroll hover-lift">
            <div className="feature-icon glow-primary">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3>高效交易</h3>
            <p>毫秒级撮合，分钟级交付，让您的交易更加快捷。</p>
            <div className="feature-border"></div>
          </div>
          <div className="feature-card fade-in-on-scroll hover-lift" style={{ animationDelay: '0.1s' }}>
            <div className="feature-icon glow-success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>安全可靠</h3>
            <p>多轨交割机制，确保您的资产安全。</p>
            <div className="feature-border"></div>
          </div>
          <div className="feature-card fade-in-on-scroll hover-lift" style={{ animationDelay: '0.2s' }}>
            <div className="feature-icon glow-info">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3>做市商友好</h3>
            <p>提供完整的 API 工具包，支持做市商策略。</p>
            <div className="feature-border"></div>
          </div>
          <div className="feature-card fade-in-on-scroll hover-lift" style={{ animationDelay: '0.3s' }}>
            <div className="feature-icon glow-warning">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h3>实时行情</h3>
            <p>提供实时的市场行情和交易数据，助您做出明智决策。</p>
            <div className="feature-border"></div>
          </div>
          </div>
        </div>
      </section>

      {/* 最新交易 */}
      <section className="recent-trades">
        <div className="card fade-in-on-scroll">
          <h2 className="section-title">最新交易</h2>
          <div className="trades-table">
            <table className="table">
              <thead>
                <tr>
                  <th>资产</th>
                  <th>价格 (USDT)</th>
                  <th>数量</th>
                  <th>时间</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map(trade => (
                  <tr key={trade.id} className="fade-in">
                    <td>{trade.symbol}</td>
                    <td>${trade.price}</td>
                    <td>{trade.quantity}</td>
                    <td>{trade.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="view-all">
            <a href="/trade" className="btn btn-outline">查看全部交易</a>
          </div>
        </div>
      </section>

      {/* 用户评价 */}
      <section className="testimonials">
        <h2 className="section-title">用户评价</h2>
        <div className="testimonials-grid fade-in-on-scroll">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Game Market 的交易速度非常快，我几乎是瞬间完成了交易，而且平台界面非常直观，使用起来很方便。"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="author-info">
                <h4>张三</h4>
                <p>资深游戏玩家</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"作为一名做市商，我非常喜欢 Game Market 提供的 API 工具，它让我的交易策略执行得更加高效。"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="author-info">
                <h4>李四</h4>
                <p>专业做市商</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"平台的安全措施让我很放心，我的资产一直很安全，而且客服响应速度也很快，有问题能及时解决。"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="author-info">
                <h4>王五</h4>
                <p>游戏饰品收藏家</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 行动召唤 */}
      <section className="cta">
        <div className="cta-content fade-in-on-scroll">
          <h2>开始您的交易之旅</h2>
          <p>加入 Game Market，体验安全、高效的游戏饰品交易服务。</p>
          <div className="cta-buttons">
            <a href="/trade" className="btn btn-primary">立即交易</a>
            <a href="/wallet" className="btn btn-secondary">充值资金</a>
          </div>
          <div className="cta-features">
            <div className="cta-feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>安全可靠</span>
            </div>
            <div className="cta-feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>高效交易</span>
            </div>
            <div className="cta-feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <span>实时行情</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;