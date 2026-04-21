const teachersDL = require('../DL/teachersDL');

const getById = async (id) => teachersDL.getById(id);

const getAll = async (filters = {}) => teachersDL.getAll(filters);

const insert = async (teacher) => {
  const required = ['first_name', 'last_name', 'id_number', 'class_name'];
  for (const field of required) {
    if (!teacher[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return teachersDL.insert(teacher);
};

module.exports = {
  getById,
  getAll,
  insert,
};
