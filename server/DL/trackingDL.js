const connectDB = require('../db/init/connection');

class TrackingDL {
  /* Checks whether a student exists by ID number. */
  static async studentExists(idNumber) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.query(
        'SELECT id_number FROM Students WHERE id_number = ?',
        [idNumber],
      );
      return rows.length > 0;
    } finally {
      await connection.end();
    }
  }

  /* Inserts or updates the latest location row for one student. */
  static async upsertLatestLocation(payload) {
    const connection = await connectDB();
    try {
      await connection.query(
        `
          INSERT INTO StudentLocationsLatest (
            student_id_number,
            longitude_decimal,
            latitude_decimal,
            raw_longitude_deg,
            raw_longitude_min,
            raw_longitude_sec,
            raw_latitude_deg,
            raw_latitude_min,
            raw_latitude_sec,
            device_time
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            longitude_decimal = VALUES(longitude_decimal),
            latitude_decimal = VALUES(latitude_decimal),
            raw_longitude_deg = VALUES(raw_longitude_deg),
            raw_longitude_min = VALUES(raw_longitude_min),
            raw_longitude_sec = VALUES(raw_longitude_sec),
            raw_latitude_deg = VALUES(raw_latitude_deg),
            raw_latitude_min = VALUES(raw_latitude_min),
            raw_latitude_sec = VALUES(raw_latitude_sec),
            device_time = VALUES(device_time)
        `,
        [
          payload.student_id_number,
          payload.longitude_decimal,
          payload.latitude_decimal,
          payload.raw_longitude_deg,
          payload.raw_longitude_min,
          payload.raw_longitude_sec,
          payload.raw_latitude_deg,
          payload.raw_latitude_min,
          payload.raw_latitude_sec,
          payload.device_time,
        ],
      );
    } finally {
      await connection.end();
    }
  }

  /* Returns latest location rows for all students. */
  static async getLatestAll() {
    const connection = await connectDB();
    try {
      const [rows] = await connection.query(
        `
          SELECT
            student_id_number,
            longitude_decimal,
            latitude_decimal,
            raw_longitude_deg,
            raw_longitude_min,
            raw_longitude_sec,
            raw_latitude_deg,
            raw_latitude_min,
            raw_latitude_sec,
            device_time,
            received_at
          FROM StudentLocationsLatest
          ORDER BY student_id_number ASC
        `,
      );
      return rows;
    } finally {
      await connection.end();
    }
  }

  /* Returns the latest location row for a specific student ID number. */
  static async getLatestByIdNumber(idNumber) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.query(
        `
          SELECT
            student_id_number,
            longitude_decimal,
            latitude_decimal,
            raw_longitude_deg,
            raw_longitude_min,
            raw_longitude_sec,
            raw_latitude_deg,
            raw_latitude_min,
            raw_latitude_sec,
            device_time,
            received_at
          FROM StudentLocationsLatest
          WHERE student_id_number = ?
        `,
        [idNumber],
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }
}

module.exports = TrackingDL;
