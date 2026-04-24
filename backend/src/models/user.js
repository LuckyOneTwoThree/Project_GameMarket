module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    steam_id: {
      type: Sequelize.STRING(50),
      unique: true
    },
    trade_url: {
      type: Sequelize.STRING(255)
    },
    role: {
      type: Sequelize.STRING(20),
      defaultValue: 'user'
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
    tableName: 'users',
    timestamps: true,
    underscored: true
  });
  
  return User;
};