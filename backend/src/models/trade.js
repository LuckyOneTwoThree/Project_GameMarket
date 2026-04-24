module.exports = (sequelize, Sequelize) => {
  const Trade = sequelize.define('Trade', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    buy_order_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    sell_order_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    sku_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'skus',
        key: 'id'
      }
    },
    price: {
      type: Sequelize.DECIMAL(20, 8),
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    buyer_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    seller_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: 'pending'
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
    tableName: 'trades',
    timestamps: true,
    underscored: true
  });
  
  return Trade;
};