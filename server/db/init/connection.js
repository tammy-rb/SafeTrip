const mysql = require('mysql2/promise');    // async\await style MySQL client
require('dotenv').config();

const connectDB = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
  });

  console.log('MySQL connected');
  return connection;
};

module.exports = connectDB;