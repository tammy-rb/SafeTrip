const dotenv = require('dotenv');
const { ENV_PATH } = require('./paths');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const studentsRoutes = require('./routes/studentsRoutes');
const teachersRoutes = require('./routes/teachersRoutes');
const authRoutes = require('./routes/authRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const { requireAuth, requireTeacher } = require('./middleware/authMiddleware');

dotenv.config({ path: ENV_PATH });

const PORT = process.env.PORT || 5000;
const app = express();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

/* Enables cross-origin requests from the React client with cookies. */
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'SafeTrip server is running' });
});

app.use('/auth', authRoutes);
app.use('/tracking', trackingRoutes);
app.use('/students', requireAuth, requireTeacher, studentsRoutes);
app.use('/teachers', requireAuth, requireTeacher, teachersRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
