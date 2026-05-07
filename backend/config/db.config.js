const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
      evict: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ MySQL connected'))
  .catch(err => console.error('❌ DB error:', err.message));

module.exports = { sequelize };