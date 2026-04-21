const connectDB = require('../db/init/connection');

class AuthDL {
  static async findPasswordByIdNumber(idNumber) {
    const connection = await connectDB();
    try {
      const [rows] = await connection.query(
        'SELECT id_number, password_hash FROM Passwords WHERE id_number = ?',
        [idNumber],
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  static async insertPassword(idNumber, passwordHash) {
    const connection = await connectDB();
    try {
      await connection.query(
        'INSERT INTO Passwords (id_number, password_hash) VALUES (?, ?)',
        [idNumber, passwordHash],
      );
    } finally {
      await connection.end();
    }
  }

  /*
    * Checks if the given ID number belongs to a teacher, student, or neither.
  */
  static async resolveUserRole(idNumber) {
    const connection = await connectDB();
    try {
      const [teacherRows] = await connection.query(
        'SELECT id_number FROM Teachers WHERE id_number = ?',
        [idNumber],
      );

      const [studentRows] = await connection.query(
        'SELECT id_number FROM Students WHERE id_number = ?',
        [idNumber],
      );

      const isTeacher = teacherRows.length > 0;
      const isStudent = studentRows.length > 0;

      if (isTeacher) {
        return 'teacher';
      }

      if (isStudent) {
        return 'student';
      }

      return null;
    } finally {
      await connection.end();
    }
  }

  static async getUserDetailsByRoleAndIdNumber(role, idNumber) {
    const connection = await connectDB();
    try {
      if (role === 'teacher') {
        const [rows] = await connection.query(
          'SELECT id, first_name, last_name, id_number, class_name FROM Teachers WHERE id_number = ?',
          [idNumber],
        );
        return rows[0] || null;
      }

      if (role === 'student') {
        const [rows] = await connection.query(
          'SELECT id, first_name, last_name, id_number, class_name FROM Students WHERE id_number = ?',
          [idNumber],
        );
        return rows[0] || null;
      }

      return null;
    } finally {
      await connection.end();
    }
  }
}

module.exports = AuthDL;
