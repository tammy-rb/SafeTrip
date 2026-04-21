const express = require('express');
const TrackingBL = require('../BL/trackingBL');

const router = express.Router();

/* Receives a location payload and saves it as the student's latest location. */
router.post('/location', async (req, res) => {
  try {
    const result = await TrackingBL.ingestLocation(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

/* Returns latest location rows for all students. */
router.get('/latest', async (req, res) => {
  try {
    const rows = await TrackingBL.getLatestAll();
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

/* Returns the latest location row for one student. */
router.get('/latest/:id_number', async (req, res) => {
  try {
    const row = await TrackingBL.getLatestByIdNumber(req.params.id_number);
    return res.status(200).json(row);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;
