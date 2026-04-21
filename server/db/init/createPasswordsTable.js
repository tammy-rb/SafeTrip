const connectDB = require('./connection');

const createPasswordsTable = async () => {
  const connection = await connectDB();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Passwords (
        id_number VARCHAR(20) PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL
      )
    `);
  } finally {
    await connection.end();
  }
};

module.exports = createPasswordsTable;
