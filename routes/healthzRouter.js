const express = require('express');
const healthzRouter = express.Router();
const healthzController = require('../controllers/healthzController');


console.log('healthzRouter.js is running');

healthzRouter.head('/', healthzController.notAllowed);
healthzRouter.get('/', healthzController.healthz);
healthzRouter.put('/', healthzController.notAllowed);
healthzRouter.post('/', healthzController.notAllowed);
healthzRouter.patch('/', healthzController.notAllowed);
healthzRouter.delete('/', healthzController.notAllowed);
healthzRouter.options('/', healthzController.notAllowed);

module.exports = healthzRouter;