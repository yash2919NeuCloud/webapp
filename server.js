const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const PORT = 3000;
const { Pool } = require('pg');
const mysql = require('mysql2');
app.use(bodyParser.json());
const { Sequelize, DataTypes } = require('sequelize');
const User = require('./models/userModel');
const healthzRouter = require('./routes/healthzRouter');
const userRouter = require('./routes/userRouter');
const { sequelize } = require('./config/config'); // Import your Sequelize instance



sequelize.sync({ force: true }) 


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
  
    res.status(400).header('Cache-Control', 'no-cache').send();
  } else {
    next();
  }
});

app.use('/healthz', healthzRouter);
app.use('/v1/user', userRouter);


// app.get('/healthz', async (req, res) => {
//   try {
//     const isDatabaseConnected = await checkDatabaseConnection();

//     if (isDatabaseConnected) {
//       res.status(200).header('Cache-Control', 'no-cache').send();
//     } else {

//       console.error('Database is not connected');
//       res.status(503).header('Cache-Control', 'no-cache').send();
//     }
//   } catch (error) {
//     console.error('Error checking database connection:');
//     res.status(503).header('Cache-Control', 'no-cache').send();
//   }
// });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
//   async function checkDatabaseConnection() {
//     const dbConfig = {
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//     };
  
//     const connection = mysql.createConnection(dbConfig);
  
//     return new Promise((resolve, reject) => {

//       connection.on('error', (err) => {
//         console.error('Error event caught during database connection:', err);
//         reject(err);
//       });
  
//       connection.connect((err) => {
//         if (err) {
//           console.error('Error connecting to database:', err);
//           reject(err); 
//         } else {
//           console.log('Connected to database');
//           resolve(true);
//         }
  
     
//         connection.removeListener('error', reject);
  
       
//         connection.end();
//       });
//     });
//   }
  
