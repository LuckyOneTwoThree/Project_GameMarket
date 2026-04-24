const { sequelize } = require('./index');

// 同步数据库模型
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synchronized successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database synchronization error:', error);
    process.exit(1);
  });
