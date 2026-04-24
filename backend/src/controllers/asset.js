// 导入数据库模型
const { Asset, Sku, Deposit, Withdrawal } = require('../models');

// 初始化默认SKU数据
const initializeSkus = async () => {
  try {
    // 检查是否已有SKU数据
    const existingSkus = await Sku.count();
    if (existingSkus === 0) {
      // 创建默认SKU数据
      const defaultSkus = [
        {
          game_id: 1, // 默认游戏ID
          ticker: 'AKRED-FT-T1',
          external_asset_key: 'AKRED-FT-T1', // 外部资产键
          oracle_ref_id: 1, // 预言机引用ID（整数）
          display_name_cn: 'AK-47 | Redline (Field-Tested)',
          display_name_en: 'AK-47 | Redline (Field-Tested)', // 英文名称
          asset_type: 'rifle', // 资产类型
          rarity_color: 'red', // 稀有度颜色
          search_aliases: 'ak, redline', // 搜索别名
          float_min: 0.0, // 最低磨损
          float_max: 0.7, // 最高磨损
          sticker_reject_ratio: 0.0, // 贴纸拒绝率
          pattern_whitelist: '', // 图案白名单
          match_rules: '{}', // 匹配规则（JSON格式）
          tick_size: 0.01, // 最小价格变动
          min_qty: 1, // 最小数量
          max_slippage: 0.05, // 最大滑点
          price_limit_ratio: 0.2, // 价格限制比例
          delivery_mode: 'AUTO', // 交付模式
          global_cap_limit: 1000, // 全局上限
          user_pos_limit: 100, // 用户持仓上限
          sla_minutes: 1, // 服务级别协议分钟数
          fee_maker_ovr: 0.001, // 做市商费率覆盖
          fee_taker_ovr: 0.002, //  taker费率覆盖
          is_active: true // 是否激活
        },
        {
          game_id: 1, // 默认游戏ID
          ticker: 'M4PRT-MW',
          external_asset_key: 'M4PRT-MW', // 外部资产键
          oracle_ref_id: 2, // 预言机引用ID（整数）
          display_name_cn: 'M4A4 | Printstream (Minimal Wear)',
          display_name_en: 'M4A4 | Printstream (Minimal Wear)', // 英文名称
          asset_type: 'rifle', // 资产类型
          rarity_color: 'purple', // 稀有度颜色
          search_aliases: 'm4, printstream', // 搜索别名
          float_min: 0.0, // 最低磨损
          float_max: 0.3, // 最高磨损
          sticker_reject_ratio: 0.0, // 贴纸拒绝率
          pattern_whitelist: '', // 图案白名单
          match_rules: '{}', // 匹配规则（JSON格式）
          tick_size: 0.01, // 最小价格变动
          min_qty: 1, // 最小数量
          max_slippage: 0.05, // 最大滑点
          price_limit_ratio: 0.2, // 价格限制比例
          delivery_mode: 'AUTO', // 交付模式
          global_cap_limit: 1000, // 全局上限
          user_pos_limit: 100, // 用户持仓上限
          sla_minutes: 1, // 服务级别协议分钟数
          fee_maker_ovr: 0.001, // 做市商费率覆盖
          fee_taker_ovr: 0.002, //  taker费率覆盖
          is_active: true // 是否激活
        },
        {
          game_id: 1, // 默认游戏ID
          ticker: 'GLOVE-PAN-FT',
          external_asset_key: 'GLOVE-PAN-FT', // 外部资产键
          oracle_ref_id: 3, // 预言机引用ID（整数）
          display_name_cn: 'Sport Gloves | Pandora\'s Box (Field-Tested)',
          display_name_en: 'Sport Gloves | Pandora\'s Box (Field-Tested)', // 英文名称
          asset_type: 'gloves', // 资产类型
          rarity_color: 'pink', // 稀有度颜色
          search_aliases: 'gloves, pandora', // 搜索别名
          float_min: 0.0, // 最低磨损
          float_max: 0.7, // 最高磨损
          sticker_reject_ratio: 0.0, // 贴纸拒绝率
          pattern_whitelist: '', // 图案白名单
          match_rules: '{}', // 匹配规则（JSON格式）
          tick_size: 0.01, // 最小价格变动
          min_qty: 1, // 最小数量
          max_slippage: 0.05, // 最大滑点
          price_limit_ratio: 0.2, // 价格限制比例
          delivery_mode: 'AUTO', // 交付模式
          global_cap_limit: 1000, // 全局上限
          user_pos_limit: 100, // 用户持仓上限
          sla_minutes: 1, // 服务级别协议分钟数
          fee_maker_ovr: 0.001, // 做市商费率覆盖
          fee_taker_ovr: 0.002, //  taker费率覆盖
          is_active: true // 是否激活
        },
        {
          game_id: 1, // 默认游戏ID
          ticker: 'KARAM-DOP-P1',
          external_asset_key: 'KARAM-DOP-P1', // 外部资产键
          oracle_ref_id: 4, // 预言机引用ID（整数）
          display_name_cn: 'Karambit | Doppler (Phase 1)',
          display_name_en: 'Karambit | Doppler (Phase 1)', // 英文名称
          asset_type: 'knife', // 资产类型
          rarity_color: 'red', // 稀有度颜色
          search_aliases: 'karambit, doppler', // 搜索别名
          float_min: 0.0, // 最低磨损
          float_max: 0.0, // 最高磨损（刀没有磨损）
          sticker_reject_ratio: 0.0, // 贴纸拒绝率
          pattern_whitelist: '', // 图案白名单
          match_rules: '{}', // 匹配规则（JSON格式）
          tick_size: 0.01, // 最小价格变动
          min_qty: 1, // 最小数量
          max_slippage: 0.05, // 最大滑点
          price_limit_ratio: 0.2, // 价格限制比例
          delivery_mode: 'AUTO', // 交付模式
          global_cap_limit: 1000, // 全局上限
          user_pos_limit: 100, // 用户持仓上限
          sla_minutes: 1, // 服务级别协议分钟数
          fee_maker_ovr: 0.001, // 做市商费率覆盖
          fee_taker_ovr: 0.002, //  taker费率覆盖
          is_active: true // 是否激活
        },
        {
          game_id: 1, // 默认游戏ID
          ticker: 'CASE-REV',
          external_asset_key: 'CASE-REV', // 外部资产键
          oracle_ref_id: 5, // 预言机引用ID（整数）
          display_name_cn: 'Spectrum 2 Case',
          display_name_en: 'Spectrum 2 Case', // 英文名称
          asset_type: 'case', // 资产类型
          rarity_color: 'blue', // 稀有度颜色
          search_aliases: 'case, spectrum', // 搜索别名
          float_min: 0.0, // 最低磨损
          float_max: 0.0, // 最高磨损（箱子没有磨损）
          sticker_reject_ratio: 0.0, // 贴纸拒绝率
          pattern_whitelist: '', // 图案白名单
          match_rules: '{}', // 匹配规则（JSON格式）
          tick_size: 0.01, // 最小价格变动
          min_qty: 1, // 最小数量
          max_slippage: 0.05, // 最大滑点
          price_limit_ratio: 0.2, // 价格限制比例
          delivery_mode: 'AUTO', // 交付模式
          global_cap_limit: 1000, // 全局上限
          user_pos_limit: 100, // 用户持仓上限
          sla_minutes: 1, // 服务级别协议分钟数
          fee_maker_ovr: 0.001, // 做市商费率覆盖
          fee_taker_ovr: 0.002, //  taker费率覆盖
          is_active: true // 是否激活
        }
      ];
      
      await Sku.bulkCreate(defaultSkus);
      console.log('Default SKUs created');
    }
  } catch (error) {
    console.error('Error initializing SKUs:', error);
  }
};

// 初始化SKU数据
initializeSkus();

// 获取用户资产列表
const getAssets = async (req, res) => {
  try {
    // 从数据库获取用户资产
    const userAssets = await Asset.findAll({
      where: { user_id: req.user.id }
    });
    
    if (userAssets.length === 0) {
      // 为新用户生成默认资产（多状态）
      const defaultAssets = [
        { symbol: 'AKRED-FT-T1', quantity: 10, status: 'available' },  // 可用状态
        { symbol: 'M4PRT-MW', quantity: 5, status: 'locked' },         // 锁定状态
        { symbol: 'CASE-REV', quantity: 50, status: 'available' },     // 可用状态
        { symbol: 'KARAM-DOP-P1', quantity: 2, status: 'pending' }     // 处理中状态
      ];
      
      for (const item of defaultAssets) {
        const sku = await Sku.findOne({ where: { ticker: item.symbol } });
        if (sku) {
          await Asset.create({
            user_id: req.user.id,
            sku_id: sku.id,
            quantity: item.quantity,
            status: item.status
          });
        }
      }
      
      // 重新获取用户资产
      const updatedUserAssets = await Asset.findAll({
        where: { user_id: req.user.id }
      });
      
      // 为每个资产获取SKU信息
      const assetsWithSku = [];
      for (const asset of updatedUserAssets) {
        const sku = await Sku.findByPk(asset.sku_id);
        if (sku) {
          assetsWithSku.push({
            id: asset.id,
            symbol: sku.ticker,
            quantity: asset.quantity,
            status: asset.status
          });
        }
      }
      
      res.status(200).json(assetsWithSku);
    } else {
      // 为每个资产获取SKU信息
      const assetsWithSku = [];
      for (const asset of userAssets) {
        const sku = await Sku.findByPk(asset.sku_id);
        if (sku) {
          assetsWithSku.push({
            id: asset.id,
            symbol: sku.ticker,
            quantity: asset.quantity,
            status: asset.status
          });
        }
      }
      
      res.status(200).json(assetsWithSku);
    }
  } catch (error) {
    console.error('Error getting assets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 充值资产
const depositAsset = async (req, res) => {
  try {
    console.log('Deposit request received:', req.body);
    const { assetId, quantity } = req.body;
    console.log('Asset ID:', assetId);
    console.log('Quantity:', quantity);
    // 直接根据ticker（符号）查找SKU
    let sku = await Sku.findOne({ where: { ticker: assetId } });
    console.log('Found SKU:', sku);
    
    if (!sku || !sku.is_active) {
      console.log('Asset not found or not active');
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    // 检查用户是否设置了 Steam 交易 URL
    if (!req.user.trade_url) {
      console.log('Steam trade URL not set');
      return res.status(400).json({ error: 'Steam trade URL not set' });
    }
    
    // 创建充值记录
    const deposit = await Deposit.create({
      user_id: req.user.id,
      sku_id: sku.id,
      quantity,
      status: 'pending',
      created_at: new Date()
    });
    console.log('Deposit created:', deposit);
    
    // 模拟Steam交易
    setTimeout(async () => {
      try {
        // 更新充值状态
        await deposit.update({ status: 'completed' });
        console.log('Deposit status updated to completed');
        
        // 更新用户资产
        let userAsset = await Asset.findOne({
          where: { user_id: req.user.id, sku_id: sku.id }
        });
        console.log('Found user asset:', userAsset);
        
        if (!userAsset) {
          userAsset = await Asset.create({
            user_id: req.user.id,
            sku_id: sku.id,
            quantity: 0,
            status: 'available'
          });
          console.log('Created new user asset:', userAsset);
        }
        
        await userAsset.update({ quantity: userAsset.quantity + quantity });
        console.log('Updated user asset quantity:', userAsset.quantity + quantity);
      } catch (error) {
        console.error('Error processing deposit:', error);
      }
    }, 1000);
    
    res.status(201).json({
      id: deposit.id,
      status: deposit.status,
      tradeOfferId: 'mock-trade-offer-id'
    });
    console.log('Deposit request processed successfully');
  } catch (error) {
    console.error('Error depositing asset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 提现资产
const withdrawAsset = async (req, res) => {
  try {
    console.log('Withdraw request received:', req.body);
    const { symbol, quantity, tradeUrl } = req.body;
    console.log('Symbol:', symbol);
    console.log('Quantity:', quantity);
    console.log('Trade URL:', tradeUrl);
    const sku = await Sku.findOne({ where: { ticker: symbol, is_active: true } });
    console.log('Found SKU:', sku);
    
    if (!sku) {
      console.log('Asset not found');
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    // 检查用户资产是否足够
    let asset = await Asset.findOne({
      where: { user_id: req.user.id, sku_id: sku.id }
    });
    console.log('Found user asset:', asset);
    
    if (!asset || asset.quantity < quantity) {
      console.log('Insufficient assets');
      return res.status(400).json({ error: 'Insufficient assets' });
    }
    
    // 创建提现记录
    const withdrawal = await Withdrawal.create({
      user_id: req.user.id,
      sku_id: sku.id,
      quantity,
      trade_url: tradeUrl,
      status: 'pending',
      created_at: new Date()
    });
    console.log('Withdrawal created:', withdrawal);
    
    // 模拟Steam交易
    setTimeout(async () => {
      try {
        // 更新提现状态
        await withdrawal.update({ status: 'completed' });
        console.log('Withdrawal status updated to completed');
        // 减少用户资产
        await asset.update({ quantity: asset.quantity - quantity });
        console.log('Updated user asset quantity:', asset.quantity - quantity);
      } catch (error) {
        console.error('Error processing withdrawal:', error);
      }
    }, 1000);
    
    res.status(201).json({
      id: withdrawal.id,
      status: withdrawal.status,
      tradeOfferId: 'mock-trade-offer-id'
    });
    console.log('Withdraw request processed successfully');
  } catch (error) {
    console.error('Error withdrawing asset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取充值历史
const getDepositHistory = async (req, res) => {
  try {
    const userDeposits = await Deposit.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    
    // 为每个充值记录获取 Sku 信息
    const depositsWithSku = [];
    for (const deposit of userDeposits) {
      const sku = await Sku.findByPk(deposit.sku_id);
      depositsWithSku.push({
        id: deposit.id,
        symbol: sku ? sku.ticker : 'Unknown',
        quantity: deposit.quantity,
        status: deposit.status,
        timestamp: deposit.created_at
      });
    }
    
    res.status(200).json(depositsWithSku);
  } catch (error) {
    console.error('Error getting deposit history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取提现历史
const getWithdrawHistory = async (req, res) => {
  try {
    const userWithdrawals = await Withdrawal.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    
    // 为每个提现记录获取 Sku 信息
    const withdrawalsWithSku = [];
    for (const withdrawal of userWithdrawals) {
      const sku = await Sku.findByPk(withdrawal.sku_id);
      withdrawalsWithSku.push({
        id: withdrawal.id,
        symbol: sku ? sku.ticker : 'Unknown',
        quantity: withdrawal.quantity,
        status: withdrawal.status,
        timestamp: withdrawal.created_at
      });
    }
    
    res.status(200).json(withdrawalsWithSku);
  } catch (error) {
    console.error('Error getting withdraw history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取充值状态
const getDepositStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const deposit = await Deposit.findOne({
      where: { id: parseInt(id), user_id: req.user.id }
    });
    
    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }
    
    const sku = await Sku.findByPk(deposit.sku_id);
    
    res.status(200).json({
      id: deposit.id,
      symbol: sku ? sku.ticker : 'Unknown',
      quantity: deposit.quantity,
      status: deposit.status,
      tradeOfferId: 'mock-trade-offer-id',
      timestamp: deposit.created_at
    });
  } catch (error) {
    console.error('Error getting deposit status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取提现状态
const getWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await Withdrawal.findOne({
      where: { id: parseInt(id), user_id: req.user.id }
    });
    
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }
    
    const sku = await Sku.findByPk(withdrawal.sku_id);
    
    res.status(200).json({
      id: withdrawal.id,
      symbol: sku ? sku.ticker : 'Unknown',
      quantity: withdrawal.quantity,
      status: withdrawal.status,
      tradeOfferId: 'mock-trade-offer-id',
      timestamp: withdrawal.created_at
    });
  } catch (error) {
    console.error('Error getting withdraw status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAssets,
  depositAsset,
  withdrawAsset,
  getDepositHistory,
  getWithdrawHistory,
  getDepositStatus,
  getWithdrawStatus
};
