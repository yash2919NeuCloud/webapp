const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const PORT = 3000;
const mysql = require('mysql2');
app.use(bodyParser.json());
const { Sequelize, DataTypes } = require('sequelize');
const User = require('./models/userModel');
const healthzRouter = require('./routes/healthzRouter');
const userRouter = require('./routes/userRouter');
const { sequelize } = require('./config/config'); 
const { Logging } = require('@google-cloud/logging');

sequelize.sync({ force: true }) 

const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(), // Output logs in JSON format
  transports: [
    new winston.transports.Console(), // Output logs to console
  ],
});


// Creates a client
const logging = new Logging();

// Selects the log to write to
const log = logging.log('my-log');

// Write log entries
log.write(log.entry({ severity: 'info' }, 'This is an informational log message'));

// Example usage with Winston logger
logger.info('This is an informational log message', { additionalData: 'some extra information' });


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
  
    res.status(400).header('Cache-Control', 'no-cache').send();
  } else {
    next();
  }
});

app.use('/healthz', healthzRouter);
app.use('/v1/user', userRouter);
app.use('/', (req, res) => {
  res.status(404).send();
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  module.exports = app;