const createDB = require('./createDB');
const clearDBTables = require('./clearDB');
const createTeachersTable = require('./createTeachersTable');
const createStudentsTable = require('./createStudentsTable');
const createPasswordsTable = require('./createPasswordsTable');
const seedData = require('./seedData');

const init_db = async (result) => {
  try {
    await createDB();
    await clearDBTables();
    await createTeachersTable();
    await createStudentsTable();
    await createPasswordsTable();
    await seedData();

    if (typeof result === 'function') {   //callback: result(error, data)
      result(null, 'Database and tables created successfully');
    }

    return 'Database and tables created successfully';
  } catch (error) {
    if (typeof result === 'function') {
      result(error, null);
    }

    return 'Error initializing database: ' + error.message;
  }
};

module.exports = init_db;
