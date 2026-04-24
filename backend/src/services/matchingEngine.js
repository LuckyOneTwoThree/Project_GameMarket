class OrderBook {
  constructor() {
    this.bids = []; // 买单，按价格从高到低排序
    this.asks = []; // 卖单，按价格从低到高排序
  }

  // 添加订单
  addOrder(order) {
    if (order.side === 'buy') {
      // 买单按价格从高到低排序
      this.bids.push(order);
      this.bids.sort((a, b) => b.price - a.price);
    } else if (order.side === 'sell') {
      // 卖单按价格从低到高排序
      this.asks.push(order);
      this.asks.sort((a, b) => a.price - b.price);
    }
  }

  // 移除订单
  removeOrder(orderId) {
    this.bids = this.bids.filter(order => order.id !== orderId);
    this.asks = this.asks.filter(order => order.id !== orderId);
  }

  // 匹配订单
  matchOrders() {
    const matches = [];
    
    while (this.bids.length > 0 && this.asks.length > 0) {
      const bestBid = this.bids[0];
      const bestAsk = this.asks[0];
      
      // 检查是否可以匹配
      if (bestBid.price >= bestAsk.price) {
        // 计算成交数量
        const quantity = Math.min(bestBid.quantity - bestBid.filled_quantity, bestAsk.quantity - bestAsk.filled_quantity);
        
        // 创建成交记录
        const match = {
          buyOrderId: bestBid.id,
          sellOrderId: bestAsk.id,
          price: bestAsk.price, // 按卖单价格成交
          quantity: quantity,
          timestamp: new Date()
        };
        
        matches.push(match);
        
        // 更新订单成交数量
        bestBid.filled_quantity += quantity;
        bestAsk.filled_quantity += quantity;
        
        // 检查订单是否完全成交
        if (bestBid.filled_quantity === bestBid.quantity) {
          this.bids.shift(); // 移除已完全成交的买单
        }
        
        if (bestAsk.filled_quantity === bestAsk.quantity) {
          this.asks.shift(); // 移除已完全成交的卖单
        }
      } else {
        // 没有可匹配的订单
        break;
      }
    }
    
    return matches;
  }

  // 获取订单簿深度
  getOrderBook(depth = 10) {
    return {
      bids: this.bids.slice(0, depth).map(order => [order.price, order.quantity - order.filled_quantity]),
      asks: this.asks.slice(0, depth).map(order => [order.price, order.quantity - order.filled_quantity])
    };
  }
}

class MatchingEngine {
  constructor() {
    this.orderBooks = new Map(); // 按交易对存储订单簿
  }

  // 获取或创建订单簿
  getOrderBook(symbol) {
    if (!this.orderBooks.has(symbol)) {
      this.orderBooks.set(symbol, new OrderBook());
    }
    return this.orderBooks.get(symbol);
  }

  // 添加订单
  addOrder(order) {
    const orderBook = this.getOrderBook(order.symbol);
    orderBook.addOrder(order);
    
    // 尝试匹配订单
    const matches = orderBook.matchOrders();
    return matches;
  }

  // 取消订单
  cancelOrder(symbol, orderId) {
    const orderBook = this.getOrderBook(symbol);
    orderBook.removeOrder(orderId);
  }

  // 获取订单簿深度
  getOrderBookDepth(symbol, depth = 10) {
    const orderBook = this.getOrderBook(symbol);
    return orderBook.getOrderBook(depth);
  }
}

// 导出单例
module.exports = new MatchingEngine();