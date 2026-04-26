const jwt = require('jsonwebtoken');

const getJwtSecret = () => process.env.JWT_SECRET || 'safeTripDefaultSecret';

/*
  Verifies JWT from the cookie and attaches decoded payload to `req.user`.
  Payload contains: `id_number`, `role`, etc.
*/
const requireAuth = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/* Allows access only when authenticated user's role is `teacher`. */
const requireTeacher = (req, res, next) => {
  if (req.user?.role !== 'teacher') {
    return res.status(403).json({ error: 'Teacher access only.' });
  }

  return next();
};

module.exports = {
  requireAuth,
  requireTeacher,
};
