module.exports = (sequelize, Sequelize) => {
  const Deposit = sequelize.define('Deposit', {
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
    trade_offer_id: {
      type: Sequelize.STRING(128)
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
    tableName: 'deposits',
    timestamps: true,
    underscored: true
  });
  
  return Deposit;
};