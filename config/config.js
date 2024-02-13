const { Sequelize } = require('sequelize');


try {
  console.log('DB_DATABASE', process.env.DB_DATABASE)
   sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
  });
} catch (error) {

}

  module.exports = { sequelize };
