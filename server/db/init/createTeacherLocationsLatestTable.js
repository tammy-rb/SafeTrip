const connectDB = require('./connection');

/* Creates a table that stores one latest location row per teacher. */
const createTeacherLocationsLatestTable = async () => {
  const connection = await connectDB();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS TeacherLocationsLatest (
        teacher_id VARCHAR(40) PRIMARY KEY,
        longitude_decimal DECIMAL(10, 7) NOT NULL,
        latitude_decimal DECIMAL(10, 7) NOT NULL,
        raw_longitude_deg INT NOT NULL,
        raw_longitude_min INT NOT NULL,
        raw_longitude_sec INT NOT NULL,
        raw_latitude_deg INT NOT NULL,
        raw_latitude_min INT NOT NULL,
        raw_latitude_sec INT NOT NULL,
        device_time DATETIME NOT NULL,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_teacher_locations_latest_teacher
          FOREIGN KEY (teacher_id) REFERENCES Teachers(id_number)
          ON DELETE CASCADE
      )
    `);
  } finally {
    await connection.end();
  }
};

module.exports = createTeacherLocationsLatestTable;