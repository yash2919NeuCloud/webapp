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
const {logger} = require('./config/config');
sequelize.sync() 


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.error({ message: 'Bad request', additionalData: { error: 'Invalid JSON' }});
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
   // console.log(`Server is running on port ${PORT}`);
  });
  
  module.exports = app;