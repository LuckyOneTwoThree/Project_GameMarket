module.exports = (sequelize, Sequelize) => {
  const Asset = sequelize.define('Asset', {
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
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: 'available'
    },
    deposit_time: {
      type: Sequelize.DATE
    },
    withdraw_time: {
      type: Sequelize.DATE
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
    tableName: 'assets',
    timestamps: true,
    underscored: true
  });
  
  return Asset;
};