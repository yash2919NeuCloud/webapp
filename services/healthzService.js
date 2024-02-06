const mysql = require('mysql2');
async function checkDatabaseConnection() {
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    };
  
    const connection = mysql.createConnection(dbConfig);
  
    return new Promise((resolve, reject) => {

      connection.on('error', (err) => {
        console.error('Error event caught during database connection:', err);
        reject(err);
      });
  
      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to database:', err);
          reject(err); 
        } else {
          console.log('Connected to database');
          resolve(true);
        }
  
        connection.removeListener('error', reject);

        connection.end();
      });
    });
  }
  
  module.exports = { checkDatabaseConnection };
