module.exports = (sequelize, Sequelize) => {
  const Sku = sequelize.define('Sku', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    game_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    ticker: {
      type: Sequelize.STRING(64),
      allowNull: false,
      unique: true
    },
    external_asset_key: {
      type: Sequelize.STRING(128),
      allowNull: false
    },
    oracle_ref_id: {
      type: Sequelize.INTEGER
    },
    display_name_cn: {
      type: Sequelize.STRING(128),
      allowNull: false
    },
    display_name_en: {
      type: Sequelize.STRING(128),
      allowNull: false
    },
    asset_type: {
      type: Sequelize.STRING(50)
    },
    rarity_color: {
      type: Sequelize.STRING(7)
    },
    search_aliases: {
      type: Sequelize.JSONB
    },
    float_min: {
      type: Sequelize.DECIMAL(8, 6)
    },
    float_max: {
      type: Sequelize.DECIMAL(8, 6)
    },
    sticker_reject_ratio: {
      type: Sequelize.DECIMAL(4, 2)
    },
    pattern_whitelist: {
      type: Sequelize.JSONB
    },
    match_rules: {
      type: Sequelize.JSONB,
      allowNull: false
    },
    tick_size: {
      type: Sequelize.DECIMAL(12, 4),
      allowNull: false
    },
    min_qty: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    max_slippage: {
      type: Sequelize.DECIMAL(4, 3),
      allowNull: false
    },
    price_limit_ratio: {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: false
    },
    delivery_mode: {
      type: Sequelize.STRING(20),
      defaultValue: 'AUTO'
    },
    global_cap_limit: {
      type: Sequelize.INTEGER,
      defaultValue: 1000
    },
    user_pos_limit: {
      type: Sequelize.INTEGER,
      defaultValue: 100
    },
    sla_minutes: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    fee_maker_ovr: {
      type: Sequelize.DECIMAL(6, 5)
    },
    fee_taker_ovr: {
      type: Sequelize.DECIMAL(6, 5)
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'skus',
    timestamps: true,
    underscored: true
  });
  
  return Sku;
};