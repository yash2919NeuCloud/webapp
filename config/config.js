const { Sequelize } = require('sequelize');
const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');
const logFilePath = '/var/log/webapp/app.log';

try {
  console.log('DB_DATABASE', process.env.DB_DATABASE)
   sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST ,
  });


} catch (error) {

}

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new LoggingWinston(),
    new winston.transports.File({ filename: logFilePath })
  ],
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.errors({ stack: true }), // Include stack traces for errors
    winston.format.json() // Output logs in JSON format
  )
});

  module.exports = { sequelize,logger };
