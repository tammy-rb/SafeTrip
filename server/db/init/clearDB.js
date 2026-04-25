const connectDB = require('./connection');

const clearDBTables = async () => {
  const connection = await connectDB();

  try {
    await connection.query('DROP TABLE IF EXISTS TeacherLocationsLatest');
    await connection.query('DROP TABLE IF EXISTS StudentLocationsLatest');
    await connection.query('DROP TABLE IF EXISTS Passwords');
    await connection.query('DROP TABLE IF EXISTS Students');
    await connection.query('DROP TABLE IF EXISTS Teachers');
  } finally {
    await connection.end();
  }
};

module.exports = clearDBTables;
