const express = require('express');
const TrackingBL = require('../BL/trackingBL');
const { requireAuth, requireTeacher } = require('../middleware/authMiddleware');
const { requireStudentOwnTrackingId } = require('../middleware/trackingMiddleware');

const router = express.Router();

/* Receives a location payload and saves it as the student's latest location. */
router.post('/location', requireAuth, requireStudentOwnTrackingId, async (req, res) => {
  try {
    const result = await TrackingBL.ingestLocation(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

/* Returns latest location rows for all students. */
router.get('/latest', requireAuth, requireTeacher, async (req, res) => {
  try {
    const filters = {
      class_name: req.query.class_name || req.query.class,
    };

    const rows = await TrackingBL.getLatestAll(filters);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

/* Returns class student locations with distance and >3km flag from teacher latest location. */
router.get('/locations-alerts', requireAuth, requireTeacher, async (req, res) => {
  try {
    const result = await TrackingBL.getLocationsWithAlertsForTeacher(req.user.id_number);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

/* Returns latest location for the currently authenticated student. */
router.get('/my-latest', requireAuth, async (req, res) => {
  try {
    if (req.user?.role !== 'student') {
      return res.status(403).json({ error: 'Student access only.' });
    }

    const row = await TrackingBL.getLatestByIdNumber(req.user.id_number);
    return res.status(200).json(row);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

/* Returns the latest location row for one student. */
router.get('/latest/:id_number', requireAuth, requireTeacher, async (req, res) => {
  try {
    const row = await TrackingBL.getLatestByIdNumber(req.params.id_number);
    return res.status(200).json(row);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;
