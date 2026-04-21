const express = require('express');
const teachersBL = require('../BL/teachersBL');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const teacher = await teachersBL.getById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    return res.status(200).json(teacher);
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

    const teachers = await teachersBL.getAll(filters);
    return res.status(200).json(teachers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const created = await teachersBL.insert(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
