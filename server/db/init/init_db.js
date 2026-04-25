const createDB = require('./createDB');
const clearDBTables = require('./clearDB');
const createTeachersTable = require('./createTeachersTable');
const createStudentsTable = require('./createStudentsTable');
const createPasswordsTable = require('./createPasswordsTable');
const createTeacherLocationsLatestTable = require('./createTeacherLocationsLatestTable');
const createStudentLocationsLatestTable = require('./createStudentLocationsLatestTable');
const seedData = require('./seedData');
const seedTeacherLocations = require('./seedTeacherLocations');
const seedStudentLocationsTelAviv = require('./seedStudentLocationsTelAviv');

/* Recreates the DB schema and seeds initial data. */
const init_db = async (result) => {
  try {
    await createDB();
    await clearDBTables();
    await createTeachersTable();
    await createStudentsTable();
    await createPasswordsTable();
    await createTeacherLocationsLatestTable();
    await createStudentLocationsLatestTable();
    await seedData();
    await seedTeacherLocations();
    await seedStudentLocationsTelAviv();

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

/* Allows direct execution: node db/init/init_db.js */
if (require.main === module) {
  init_db()
    .then((msg) => {
      console.log(msg);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = init_db;
