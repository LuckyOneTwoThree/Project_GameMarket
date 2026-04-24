module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    side: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    type: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(20, 8)
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    filled_quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: 'pending'
    },
    delivery_mode: {
      type: Sequelize.STRING(20)
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
    tableName: 'orders',
    timestamps: true,
    underscored: true
  });
  
  return Order;
};