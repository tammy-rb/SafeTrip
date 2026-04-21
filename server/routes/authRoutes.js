const express = require('express');
const AuthBL = require('../BL/authBL');

const router = express.Router();

/**
 * POST /register
 * Registers a new user, sets JWT cookie and returns basic user info
 */
router.post('/register', async (req, res) => {
  try {
    const { id_number, password } = req.body;

    const result = await AuthBL.register({ id_number, password });

    // Store JWT in secure cookie
    res.cookie('jwt', result.token, AuthBL.buildAuthCookieOptions());

    return res.status(201).json({
      message: 'Registration successful',
      role: result.role,
      id_number: result.id_number,
      user: result.user,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message });
  }
});

/**
 * POST /login
 * Authenticates user, sets JWT cookie and returns user info
 */
router.post('/login', async (req, res) => {
  try {
    const { id_number, password } = req.body;

    const result = await AuthBL.login({ id_number, password });

    // Store JWT in secure cookie
    res.cookie('jwt', result.token, AuthBL.buildAuthCookieOptions());

    return res.status(200).json({
      message: 'Login successful',
      role: result.role,
      id_number: result.id_number,
      user: result.user,
    });
  } catch (error) {
    return res.status(error.status || 401).json({ error: error.message });
  }
});

/**
 * POST /logout
 * Clears authentication cookie (logs the user out)
 */
router.post('/logout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;