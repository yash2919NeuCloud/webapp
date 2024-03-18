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
const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');

sequelize.sync({ force: true }) 



const loggingWinston = new LoggingWinston();

// Create a Winston logger that streams to Cloud Logging
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    // Add Cloud Logging
    loggingWinston,
  ],
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.errors({ stack: true }), // Include stack traces for errors
    winston.format.json() // Output logs in JSON format
  )
});

// Writes some log entries in JSON format
logger.error({ message: 'warp nacelles offline', additionalData: { subsystem: 'engine' } });
logger.info({ message: 'shields at 99%', additionalData: { system: 'defense' } });

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