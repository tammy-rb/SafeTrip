/* Converts decimal coordinate to DMS parts expected by tracking endpoint. */
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

/* Builds a tracking payload from decimal coordinates for one student. */
export const buildTrackingPayload = ({ idNumber, longitude, latitude }) => ({
  ID: String(idNumber),
  Coordinates: {
    Longitude: decimalToDms(longitude),
    Latitude: decimalToDms(latitude),
  },
  Time: new Date().toISOString(),
})

/* Shifts longitude by a given eastward distance in meters for current latitude. */
export const shiftLongitudeEast = ({ longitude, latitude, meters }) => {
  const cosLat = Math.cos((Number(latitude) * Math.PI) / 180)
  const safeCos = Math.max(Math.abs(cosLat), 0.000001)
  const deltaLon = Number(meters) / (111320 * safeCos)
  return Number(longitude) + deltaLon
}