const connectDB = require('./connection');

/* Converts DMS coordinate parts to decimal coordinate value. */
const dmsToDecimal = (degrees, minutes, seconds) => (
  Number((Number(degrees) + Number(minutes) / 60 + Number(seconds) / 3600).toFixed(7))
);

const teacherTrackingPayloads = [
  {
    ID: '302111111',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '55', Seconds: '80' },
      Latitude: { Degrees: '32', Minutes: '05', Seconds: '15' },
    },
    Time: '2026-04-22T13:00:00Z',
  },
  {
    ID: '302222222',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '49', Seconds: '30' },
      Latitude: { Degrees: '32', Minutes: '07', Seconds: '40' },
    },
    Time: '2026-04-22T13:05:00Z',
  },
];

/* Seeds latest locations for teachers. */
const seedTeacherLocations = async () => {
  const connection = await connectDB();

  try {
    for (const sample of teacherTrackingPayloads) {
      const lon = sample.Coordinates.Longitude;
      const lat = sample.Coordinates.Latitude;

      const longitude = dmsToDecimal(lon.Degrees, lon.Minutes, lon.Seconds);
      const latitude = dmsToDecimal(lat.Degrees, lat.Minutes, lat.Seconds);
      const deviceTime = sample.Time.replace('T', ' ').replace('Z', '');

      await connection.query(
        `
          INSERT INTO TeacherLocationsLatest (
            teacher_id,
            longitude_decimal,
            latitude_decimal,
            raw_longitude_deg,
            raw_longitude_min,
            raw_longitude_sec,
            raw_latitude_deg,
            raw_latitude_min,
            raw_latitude_sec,
            device_time
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            longitude_decimal = VALUES(longitude_decimal),
            latitude_decimal = VALUES(latitude_decimal),
            raw_longitude_deg = VALUES(raw_longitude_deg),
            raw_longitude_min = VALUES(raw_longitude_min),
            raw_longitude_sec = VALUES(raw_longitude_sec),
            raw_latitude_deg = VALUES(raw_latitude_deg),
            raw_latitude_min = VALUES(raw_latitude_min),
            raw_latitude_sec = VALUES(raw_latitude_sec),
            device_time = VALUES(device_time)
        `,
        [
          sample.ID,
          longitude,
          latitude,
          Number(lon.Degrees),
          Number(lon.Minutes),
          Number(lon.Seconds),
          Number(lat.Degrees),
          Number(lat.Minutes),
          Number(lat.Seconds),
          deviceTime,
        ],
      );
    }
  } finally {
    await connection.end();
  }
};

/* Allows direct execution: node db/init/seedTeacherLocations.js */
if (require.main === module) {
  seedTeacherLocations()
    .then(() => {
      console.log('Teacher locations seeded.');
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedTeacherLocations;