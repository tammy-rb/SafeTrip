/*
Coordinate system explanation:

Latitude  = north / south position
Longitude = east / west position

The map works with decimal coordinates like:
latitude: 32.0853
longitude: 34.7818

The tracking endpoint expects DMS format:
Degrees, Minutes, Seconds

Example:
32.0897222 → 32° 5' 23"

When moving east or west, only longitude changes.
When moving north or south, only latitude changes.

One degree of latitude is always about:
111,320 meters

One degree of longitude is different in every place:
near the equator it is about 111,320 meters,
but it becomes smaller closer to the poles.

To adjust this, we use:

longitude distance = 111,320 × cos(latitude)

Example for Tel Aviv:
latitude ≈ 32°

cos(32°) ≈ 0.848

So:

1 degree of longitude
≈ 111,320 × 0.848
≈ 94,400 meters

If we want to move 100 meters east:

deltaLongitude
= 100 / 94,400
≈ 0.00106

Then:

newLongitude
= oldLongitude + 0.00106

*/


/* Converts decimal coordinates to DMS format expected by the tracking endpoint */
export const decimalToDms = (value) => {
  const absolute = Math.abs(Number(value))
  const degrees = Math.floor(absolute)
  const minutesFloat = (absolute - degrees) * 60
  const minutes = Math.floor(minutesFloat)
  const seconds = Math.round((minutesFloat - minutes) * 60)

  if (seconds === 60) {
    return {
      Degrees: String(degrees),
      Minutes: String(minutes + 1),
      Seconds: '0',
    }
  }

  return {
    Degrees: String(degrees),
    Minutes: String(minutes),
    Seconds: String(seconds),
  }
}

/* Builds a tracking payload for one student */
export const buildTrackingPayload = ({ idNumber, longitude, latitude }) => ({
  ID: String(idNumber),
  Coordinates: {
    Longitude: decimalToDms(longitude),
    Latitude: decimalToDms(latitude),
  },
  Time: new Date().toISOString(),
})

/* Moves the point east by a given number of meters */
export const shiftLongitudeEast = ({ longitude, latitude, meters }) => {
  const cosLat = Math.cos((Number(latitude) * Math.PI) / 180)
  const safeCos = Math.max(Math.abs(cosLat), 0.000001)
  const deltaLon = Number(meters) / (111320 * safeCos)

  return Number(longitude) + deltaLon
}