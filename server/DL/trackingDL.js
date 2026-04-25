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

  /* Returns teacher row by id_number. */
  static async getTeacherByIdNumber(idNumber) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.query(
        'SELECT id_number, class_name FROM Teachers WHERE id_number = ?',
        [idNumber],
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  /* Returns latest teacher location row for one teacher id_number. */
  static async getTeacherLatestByTeacherId(teacherIdNumber) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.query(
        `
          SELECT
            teacher_id,
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
          FROM TeacherLocationsLatest
          WHERE teacher_id = ?
        `,
        [teacherIdNumber],
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  /* Returns latest location rows for all students, optionally filtered by class. */
  static async getLatestAll(filters = {}) {
    const connection = await connectDB();
    try {
      let sql = `
          SELECT
            l.student_id_number,
            l.longitude_decimal,
            l.latitude_decimal,
            l.raw_longitude_deg,
            l.raw_longitude_min,
            l.raw_longitude_sec,
            l.raw_latitude_deg,
            l.raw_latitude_min,
            l.raw_latitude_sec,
            l.device_time,
            l.received_at,
            s.class_name
          FROM StudentLocationsLatest l
          JOIN Students s ON s.id_number = l.student_id_number
      `;

      const params = [];
      if (filters.class_name) {
        sql += ' WHERE s.class_name = ?';
        params.push(filters.class_name);
      }

      sql += ' ORDER BY l.student_id_number ASC';

      const [rows] = await connection.query(sql, params);
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
