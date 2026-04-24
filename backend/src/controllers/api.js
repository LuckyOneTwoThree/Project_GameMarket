const { Order, Sku, Asset, Trade } = require('../models');
const { Op, Sequelize } = require('sequelize');

// 批量创建订单
const batchCreateOrders = async (req, res) => {
  try {
    const { orders } = req.body;
    
    const createdOrders = [];
    
    for (const orderData of orders) {
      const order = await Order.create({
        user_id: req.user.id,
        sku_id: orderData.sku_id,
        side: orderData.side,
        type: orderData.type,
        price: orderData.price,
        quantity: orderData.quantity,
        filled_quantity: 0,
        status: 'pending',
        created_at: new Date()
      });
      createdOrders.push(order);
    }
    
    res.status(201).json(createdOrders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 批量取消订单
const batchCancelOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;
    
    await Order.update(
      { status: 'cancelled' },
      {
        where: {
          id: { [Op.in]: orderIds },
          user_id: req.user.id,
          status: 'pending'
        }
      }
    );
    
    res.status(200).json({ message: 'Orders cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取用户订单统计
const getUserOrderStats = async (req, res) => {
  try {
    const stats = await Order.findAll({
      where: { user_id: req.user.id },
      attributes: [
        'side',
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity']
      ],
      group: ['side', 'status']
    });
    
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取市场统计数据
const getMarketStats = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const sku = await Sku.findOne({ where: { ticker: symbol } });
    if (!sku) {
      return res.status(404).json({ error: 'Symbol not found' });
    }
    
    const stats = await Trade.findAll({
      where: { sku_id: sku.id },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'tradeCount'],
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalVolume'],
        [Sequelize.fn('AVG', Sequelize.col('price')), 'averagePrice']
      ]
    });
    
    res.status(200).json(stats[0] || { tradeCount: 0, totalVolume: 0, averagePrice: 0 });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 批量获取资产
const batchGetAssets = async (req, res) => {
  try {
    const { skuIds } = req.body;
    
    const assets = await Asset.findAll({
      where: {
        user_id: req.user.id,
        sku_id: { [Op.in]: skuIds }
      },
      include: [{ model: Sku }]
    });
    
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取用户资产统计
const getUserAssetStats = async (req, res) => {
  try {
    const stats = await Asset.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Sku }],
      attributes: [
        'sku_id',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity']
      ],
      group: ['sku_id', 'Sku.id']
    });
    
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  batchCreateOrders,
  batchCancelOrders,
  getUserOrderStats,
  getMarketStats,
  batchGetAssets,
  getUserAssetStats
};
