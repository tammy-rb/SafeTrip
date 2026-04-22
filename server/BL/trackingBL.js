const TrackingDL = require('../DL/trackingDL');

class TrackingBL {
  /* Creates an error object with HTTP status. */
  static makeError(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    return error;
  }

  /* Validates that ID is exactly 9 digits. */
  static validateIdNumber(idNumber) {
    return /^\d{9}$/.test(String(idNumber || ''));
  }

  /* Parses an integer field and throws on invalid values. */
  static parseIntegerField(value, label) {
    const parsed = Number.parseInt(String(value), 10);
    if (Number.isNaN(parsed)) {
      throw this.makeError(`${label} must be a valid integer.`, 400);
    }
    return parsed;
  }

  /* Converts DMS coordinates to decimal and validates range. */
  static dmsToDecimal(degrees, minutes, seconds, type) {
    const maxDegrees = type === 'latitude' ? 90 : 180;

    if (degrees < 0 || degrees > maxDegrees) {
      throw this.makeError(`${type} degrees out of range.`, 400);
    }

    if (minutes < 0 || minutes > 59) {
      throw this.makeError(`${type} minutes out of range.`, 400);
    }

    if (seconds < 0 || seconds > 59) {
      throw this.makeError(`${type} seconds out of range.`, 400);
    }

    return Number((degrees + minutes / 60 + seconds / 3600).toFixed(7));  // 7 digits precision after point
  }

  /* Validates and normalizes incoming tracking payload. */
  static normalizePayload(body) {
    const idNumber = String(body?.ID || '');
    if (!this.validateIdNumber(idNumber)) {
      throw this.makeError('ID must be exactly 9 digits.', 400);
    }

    const longitude = body?.Coordinates?.Longitude;
    const latitude = body?.Coordinates?.Latitude;

    if (!longitude || !latitude) {
      throw this.makeError('Coordinates.Longitude and Coordinates.Latitude are required.', 400);
    }

    const lonDeg = this.parseIntegerField(longitude.Degrees, 'Longitude degrees');
    const lonMin = this.parseIntegerField(longitude.Minutes, 'Longitude minutes');
    const lonSec = this.parseIntegerField(longitude.Seconds, 'Longitude seconds');
    const latDeg = this.parseIntegerField(latitude.Degrees, 'Latitude degrees');
    const latMin = this.parseIntegerField(latitude.Minutes, 'Latitude minutes');
    const latSec = this.parseIntegerField(latitude.Seconds, 'Latitude seconds');

    const deviceDate = new Date(body?.Time);
    if (!body?.Time || Number.isNaN(deviceDate.getTime())) {
      throw this.makeError('Time must be a valid ISO date string.', 400);
    }

    return {
      student_id_number: idNumber,
      longitude_decimal: this.dmsToDecimal(lonDeg, lonMin, lonSec, 'longitude'),
      latitude_decimal: this.dmsToDecimal(latDeg, latMin, latSec, 'latitude'),
      raw_longitude_deg: lonDeg,
      raw_longitude_min: lonMin,
      raw_longitude_sec: lonSec,
      raw_latitude_deg: latDeg,
      raw_latitude_min: latMin,
      raw_latitude_sec: latSec,
      device_time: deviceDate.toISOString().slice(0, 19).replace('T', ' '), // convert ISO to MySQL DATETIME format
    };
  }

  /* Validates payload and upserts latest location for the student. */
  static async ingestLocation(body) {
    const normalized = this.normalizePayload(body);

    const exists = await TrackingDL.studentExists(normalized.student_id_number);
    if (!exists) {
      throw this.makeError('Student ID does not exist.', 404);
    }

    await TrackingDL.upsertLatestLocation(normalized);
    return { ok: true };
  }

  /* Returns latest locations for all students, with optional class filter. */
  static async getLatestAll(filters = {}) {
    return TrackingDL.getLatestAll(filters);
  }

  /* Returns latest location for one student by ID number. */
  static async getLatestByIdNumber(idNumber) {
    if (!this.validateIdNumber(idNumber)) {
      throw this.makeError('id_number must be exactly 9 digits.', 400);
    }

    const row = await TrackingDL.getLatestByIdNumber(idNumber);
    if (!row) {
      throw this.makeError('Latest location not found for this student.', 404);
    }

    return row;
  }
}

module.exports = TrackingBL;
