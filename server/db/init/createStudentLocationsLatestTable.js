const connectDB = require('./connection');

const createStudentLocationsLatestTable = async () => {
  const connection = await connectDB();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS StudentLocationsLatest (
        student_id_number VARCHAR(20) PRIMARY KEY,
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
        CONSTRAINT fk_student_locations_latest_student
          FOREIGN KEY (student_id_number) REFERENCES Students(id_number)
          ON DELETE CASCADE
      )
    `);
  } finally {
    await connection.end();
  }
};

module.exports = createStudentLocationsLatestTable;
