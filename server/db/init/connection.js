const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { ENV_PATH } = require('../../paths');

dotenv.config({ path: ENV_PATH });

/* Opens a MySQL connection using environment configuration. */
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