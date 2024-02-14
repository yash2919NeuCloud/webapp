const { Sequelize } = require('sequelize');


try {
  console.log('DB_DATABASE', process.env.DB_DATABASE)
   sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST ,
  });
  sequelize.query('CREATE DATABASE IF NOT EXISTS database1;')
  .then(() => {
    console.log('Database created or already exists.');
  })
  .catch((err) => {
    console.error('Error creating database:', err);
  });

} catch (error) {

}

  module.exports = { sequelize };
