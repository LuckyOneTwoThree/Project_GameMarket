const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

class SteamService {
  constructor() {
    this.client = new SteamUser();
    this.community = new SteamCommunity();
    this.manager = new TradeOfferManager({
      steam: this.client,
      community: this.community,
      domain: 'gamemarket.com',
      language: 'en'
    });
    
    this.loggedIn = false;
    this.init();
  }

  // 初始化 Steam 连接
  init() {
    this.client.logOn({
      accountName: process.env.STEAM_BOT_USERNAME,
      password: process.env.STEAM_BOT_PASSWORD
    });

    this.client.on('loggedOn', () => {
      console.log('Steam bot logged on');
      this.loggedIn = true;
    });

    this.client.on('error', (err) => {
      console.error('Steam error:', err);
    });

    this.manager.on('newOffer', (offer) => {
      console.log('New trade offer received:', offer.id);
      // 处理新的交易报价
    });

    this.manager.on('receivedOfferChanged', (offer, oldState) => {
      console.log(`Offer ${offer.id} changed from ${oldState} to ${offer.state}`);
      // 处理交易报价状态变化
    });
  }

  // 生成交易报价
  async createTradeOffer(tradeUrl, itemsToSend, itemsToReceive) {
    if (!this.loggedIn) {
      throw new Error('Steam bot not logged in');
    }

    return new Promise((resolve, reject) => {
      const offer = this.manager.createOffer(tradeUrl);
      
      // 添加要发送的物品
      for (const item of itemsToSend) {
        offer.addMyItem(item);
      }
      
      // 添加要接收的物品
      for (const item of itemsToReceive) {
        offer.addTheirItem(item);
      }
      
      offer.setMessage('Game Market 交易');
      
      offer.send((err, status) => {
        if (err) {
          reject(err);
        } else {
          resolve({ tradeOfferId: offer.id, status });
        }
      });
    });
  }

  // 获取交易报价状态
  async getTradeOfferStatus(tradeOfferId) {
    if (!this.loggedIn) {
      throw new Error('Steam bot not logged in');
    }

    return new Promise((resolve, reject) => {
      this.manager.getOffer(tradeOfferId, (err, offer) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: offer.id,
            state: offer.state,
            itemsToSend: offer.itemsToSend,
            itemsToReceive: offer.itemsToReceive
          });
        }
      });
    });
  }

  // 取消交易报价
  async cancelTradeOffer(tradeOfferId) {
    if (!this.loggedIn) {
      throw new Error('Steam bot not logged in');
    }

    return new Promise((resolve, reject) => {
      this.manager.getOffer(tradeOfferId, (err, offer) => {
        if (err) {
          reject(err);
        } else {
          offer.cancel((err) => {
            if (err) {
              reject(err);
            } else {
              resolve({ success: true });
            }
          });
        }
      });
    });
  }

  // 获取库存
  async getInventory(steamId, appId = 730, contextId = 2) {
    if (!this.loggedIn) {
      throw new Error('Steam bot not logged in');
    }

    return new Promise((resolve, reject) => {
      this.manager.getUserInventoryContents(steamId, appId, contextId, true, (err, items) => {
        if (err) {
          reject(err);
        } else {
          resolve(items);
        }
      });
    });
  }
}

// 导出单例
module.exports = new SteamService();