module.exports = (sequelize, Sequelize) => {
  const Wallet = sequelize.define('Wallet', {
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
    currency: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    balance: {
      type: Sequelize.DECIMAL(20, 8),
      defaultValue: 0
    },
    frozen_balance: {
      type: Sequelize.DECIMAL(20, 8),
      defaultValue: 0
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
    tableName: 'wallets',
    timestamps: true,
    underscored: true
  });
  
  return Wallet;
};