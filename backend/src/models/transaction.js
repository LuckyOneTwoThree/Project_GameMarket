module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define('Transaction', {
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
    type: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    amount: {
      type: Sequelize.DECIMAL(20, 8),
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: 'pending'
    },
    reference_id: {
      type: Sequelize.INTEGER
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
    tableName: 'transactions',
    timestamps: true,
    underscored: true
  });
  
  return Transaction;
};