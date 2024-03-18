const healthzService = require('../services/healthzService');
const logger = require('../server').logger;
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
                logger.error({message: 'Database is not connected', additionalData: { subsystem: error } });
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