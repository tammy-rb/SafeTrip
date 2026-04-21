const connectDB = require('../db/init/connection');

const getById = async (id) => {
  const connection = await connectDB();
  try {
    const [rows] = await connection.query(
      'SELECT id, first_name, last_name, id_number, class_name FROM Students WHERE id = ?',
      [id],
    );
    return rows[0] || null;
  } finally {
    await connection.end();
  }
};

const getAll = async (filters = {}) => {
  const connection = await connectDB();
  try {
    let sql = 'SELECT id, first_name, last_name, id_number, class_name FROM Students';
    const conditions = [];
    const params = [];

    if (filters.class_name) {
      conditions.push('class_name = ?');
      params.push(filters.class_name);
    }

    if (filters.id_number) {
      conditions.push('id_number = ?');
      params.push(filters.id_number);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    const [rows] = await connection.query(sql, params);
    return rows;
  } finally {
    await connection.end();
  }
};

const insert = async (student) => {
  const connection = await connectDB();
  try {
    const [result] = await connection.query(
      'INSERT INTO Students (first_name, last_name, id_number, class_name) VALUES (?, ?, ?, ?)',
      [student.first_name, student.last_name, student.id_number, student.class_name],
    );

    return {
      id: result.insertId,
      ...student,
    };
  } finally {
    await connection.end();
  }
};

module.exports = {
  getById,
  getAll,
  insert,
};
