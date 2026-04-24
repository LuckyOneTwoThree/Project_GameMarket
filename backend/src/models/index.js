const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

// 根据环境变量选择数据库类型
const dbType = process.env.DB_TYPE || 'sqlite'; // 'sqlite' 或 'postgres'

let sequelize;

if (dbType === 'sqlite') {
  // SQLite 配置 - 开发环境使用
  const dbPath = process.env.SQLITE_PATH || path.join(__dirname, '../../data/database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
  });
  console.log('Using SQLite database at:', dbPath);
} else {
  // PostgreSQL 配置 - 生产环境使用
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'gamemarket',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true'
    }
  });
  console.log('Using PostgreSQL database');
}

// 导入模型
const User = require('./user')(sequelize, Sequelize);
const Sku = require('./sku')(sequelize, Sequelize);
const Asset = require('./asset')(sequelize, Sequelize);
const Order = require('./order')(sequelize, Sequelize);
const Trade = require('./trade')(sequelize, Sequelize);
const Deposit = require('./deposit')(sequelize, Sequelize);
const Withdrawal = require('./withdrawal')(sequelize, Sequelize);
const Wallet = require('./wallet')(sequelize, Sequelize);
const Transaction = require('./transaction')(sequelize, Sequelize);
const Notification = require('./notification')(sequelize, Sequelize);

// 定义关联关系
// User 关联
User.hasMany(Asset, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });
User.hasMany(Deposit, { foreignKey: 'user_id' });
User.hasMany(Withdrawal, { foreignKey: 'user_id' });
User.hasMany(Wallet, { foreignKey: 'user_id' });
User.hasMany(Transaction, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });

// Sku 关联
Sku.hasMany(Asset, { foreignKey: 'sku_id' });
Sku.hasMany(Order, { foreignKey: 'sku_id' });
Sku.hasMany(Trade, { foreignKey: 'sku_id' });
Sku.hasMany(Deposit, { foreignKey: 'sku_id' });
Sku.hasMany(Withdrawal, { foreignKey: 'sku_id' });

// Order 关联
Order.hasMany(Trade, { foreignKey: 'buy_order_id' });
Order.hasMany(Trade, { foreignKey: 'sell_order_id' });

// 导出模型
module.exports = {
  sequelize,
  User,
  Sku,
  Asset,
  Order,
  Trade,
  Deposit,
  Withdrawal,
  Wallet,
  Transaction,
  Notification
};
