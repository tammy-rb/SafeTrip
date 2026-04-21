const studentsDL = require('../DL/studentsDL');

const getById = async (id) => studentsDL.getById(id);

const getAll = async (filters = {}) => studentsDL.getAll(filters);

const insert = async (student) => {
  const required = ['first_name', 'last_name', 'id_number', 'class_name'];
  for (const field of required) {
    if (!student[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return studentsDL.insert(student);
};

module.exports = {
  getById,
  getAll,
  insert,
};
