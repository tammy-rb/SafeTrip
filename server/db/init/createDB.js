const mysql = require('mysql2/promise');
require('dotenv').config();

const createDB = async () => {
  const dbName = process.env.MYSQL_DB;
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  } finally {
    await connection.end();
  }
};

module.exports = createDB;
