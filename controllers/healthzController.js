const healthzService = require('../services/healthzService');
const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');
const logFilePath = '/var/log/webapp.log';
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

async function healthz(req, res) {
  if (Object.keys(req.body).length > 0) {
    res.status(400).header('Cache-Control', 'no-cache').send();
    return;
  }
    try {
        const isDatabaseConnected = await healthzService.checkDatabaseConnection();
        console.log('isDatabaseConnected:', isDatabaseConnected);
        if (isDatabaseConnected) {
         logger.info({message: 'Database is connected'});
                  res.status(200).header('Cache-Control', 'no-cache').send();
                } else {
                  logger.error({message: 'Database is not connected'});
                  //console.error('Database is not connected');
                  res.status(503).header('Cache-Control', 'no-cache').send();
                }
              } catch (error) {
                logger.error({message: 'Database is not connected'});
               // console.error('Error checking database connection:',error);
                res.status(503).header('Cache-Control', 'no-cache').send();
              }
  }

  async function notAllowed(req, res) {
    logger.error({message: 'notAllowed' });
  //  console.log('notAllowed');
    res.status(405).header('Cache-Control', 'no-cache').send();
  }

  module.exports = {healthz,notAllowed };