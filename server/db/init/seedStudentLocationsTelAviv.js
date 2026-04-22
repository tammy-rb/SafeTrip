const connectDB = require('./connection');

/* Converts DMS coordinate parts to decimal coordinate value. */
const dmsToDecimal = (degrees, minutes, seconds) => (
  Number((Number(degrees) + Number(minutes) / 60 + Number(seconds) / 3600).toFixed(7))
);

/* Real tracking payload samples for points around Tel Aviv within about 1km. */
const telAvivTrackingPayloads = [
  {
    ID: '323000001',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '47', Seconds: '01' },
      Latitude: { Degrees: '32', Minutes: '05', Seconds: '20' },
    },
    Time: '2026-04-22T12:30:00Z',
  },
  {
    ID: '323000002',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '46', Seconds: '44' },
      Latitude: { Degrees: '32', Minutes: '05', Seconds: '28' },
    },
    Time: '2026-04-22T12:31:00Z',
  },
  {
    ID: '323000003',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '46', Seconds: '35' },
      Latitude: { Degrees: '32', Minutes: '05', Seconds: '10' },
    },
    Time: '2026-04-22T12:32:00Z',
  },
  {
    ID: '323000004',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '47', Seconds: '07' },
      Latitude: { Degrees: '32', Minutes: '05', Seconds: '41' },
    },
    Time: '2026-04-22T12:33:00Z',
  },
  {
    ID: '323000005',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '46', Seconds: '21' },
      Latitude: { Degrees: '32', Minutes: '04', Seconds: '58' },
    },
    Time: '2026-04-22T12:34:00Z',
  },
  {
    ID: '323000006',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '47', Seconds: '16' },
      Latitude: { Degrees: '32', Minutes: '05', Seconds: '04' },
    },
    Time: '2026-04-22T12:35:00Z',
  },
  {
    ID: '323000007',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '46', Seconds: '14' },
      Latitude: { Degrees: '32', Minutes: '05', Seconds: '46' },
    },
    Time: '2026-04-22T12:36:00Z',
  },
  {
    ID: '323000008',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '47', Seconds: '10' },
      Latitude: { Degrees: '32', Minutes: '04', Seconds: '49' },
    },
    Time: '2026-04-22T12:37:00Z',
  },
  {
    ID: '323000009',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '46', Seconds: '30' },
      Latitude: { Degrees: '32', Minutes: '05', Seconds: '55' },
    },
    Time: '2026-04-22T12:38:00Z',
  },
  {
    ID: '323000010',
    Coordinates: {
      Longitude: { Degrees: '34', Minutes: '47', Seconds: '03' },
      Latitude: { Degrees: '32', Minutes: '04', Seconds: '52' },
    },
    Time: '2026-04-22T12:39:00Z',
  },
];

/* Seeds latest locations for all students in a Tel Aviv cluster within about 1km. */
const seedStudentLocationsTelAviv = async () => {
  const connection = await connectDB();

  try {
    const [students] = await connection.query(
      'SELECT id_number FROM Students ORDER BY id_number ASC',
    );

    for (let index = 0; index < students.length; index += 1) {
      const student = students[index];
      const sample = telAvivTrackingPayloads[index % telAvivTrackingPayloads.length];

      const lon = sample.Coordinates.Longitude;
      const lat = sample.Coordinates.Latitude;

      const longitude = dmsToDecimal(lon.Degrees, lon.Minutes, lon.Seconds);
      const latitude = dmsToDecimal(lat.Degrees, lat.Minutes, lat.Seconds);
      const deviceTime = sample.Time.replace('T', ' ').replace('Z', '');

      // Insert or update the latest location for the student based on their ID number.
      await connection.query(
        `
          INSERT INTO StudentLocationsLatest (
            student_id_number,
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
          student.id_number,
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

/* Allows direct execution: node db/init/seedStudentLocationsTelAviv.js */
if (require.main === module) {
  seedStudentLocationsTelAviv()
    .then(() => {
      console.log('Student locations seeded for Tel Aviv cluster.');
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedStudentLocationsTelAviv;
