const express = require('express');
const studentsBL = require('../BL/studentsBL');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const student = await studentsBL.getById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const filters = {
      class_name: req.query.class_name || req.query.class,
      id_number: req.query.id_number,
    };

    const students = await studentsBL.getAll(filters);
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const student_created = await studentsBL.insert(req.body);
    return res.status(201).json(student_created);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
