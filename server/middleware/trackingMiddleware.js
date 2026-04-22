/* Checks that the student ID in JWT cookie payload matches request body ID. */
const requireStudentOwnTrackingId = (req, res, next) => {
  if (req.user?.role !== 'student') {
    return res.status(403).json({ error: 'Only students can send tracking location updates.' });
  }

  const bodyId = String(req.body?.ID || '');
  if (!bodyId) {
    return res.status(400).json({ error: 'ID is required in tracking payload.' });
  }

  if (bodyId !== String(req.user.id_number)) {
    return res.status(403).json({ error: 'You can only send tracking updates for your own ID.' });
  }

  return next();
};

module.exports = {
  requireStudentOwnTrackingId,
};
