const connectDB = require('./connection');

const createTeachersTable = async () => {
  const connection = await connectDB();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(80) NOT NULL,
        last_name VARCHAR(80) NOT NULL,
        id_number VARCHAR(20) NOT NULL UNIQUE,
        class_name VARCHAR(20) NOT NULL
      )
    `);
  } finally {
    await connection.end();
  }
};

module.exports = createTeachersTable;
