const healthzService = require('../services/healthzService');

async function healthz(req, res) {
  if (Object.keys(req.body).length > 0) {
    res.status(400).header('Cache-Control', 'no-cache').send();
    return;
  }
    try {
        const isDatabaseConnected = await healthzService.checkDatabaseConnection();
        console.log('isDatabaseConnected:', isDatabaseConnected);
        if (isDatabaseConnected) {
                  res.status(200).header('Cache-Control', 'no-cache').send();
                } else {
            
                  console.error('Database is not connected');
                  res.status(503).header('Cache-Control', 'no-cache').send();
                }
              } catch (error) {
                
                console.error('Error checking database connection:',error);
                res.status(503).header('Cache-Control', 'no-cache').send();
              }
  }

  async function notAllowed(req, res) {
    console.log('notAllowed');
    res.status(405).header('Cache-Control', 'no-cache').send();
  }

  module.exports = {healthz,notAllowed };