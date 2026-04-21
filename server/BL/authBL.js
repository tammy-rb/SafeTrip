const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthDL = require('../DL/authDL');

/**
 * Business Logic layer for authentication
 * Handles validation, hashing, token creation and login/register flows
 */
class AuthBL {

  /**
   * Creates a standardized error object with HTTP status
   */
  static makeError(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    return error;
  }

  /**
   * Validates Israeli ID format (9 digits)
   */
  static validateIdNumber(idNumber) {
    const value = String(idNumber || '');
    if (!/^\d{9}$/.test(value)) {
      return false;
    }
    return true;
  }

  /**
   * Ensures password strength:
   * at least 8 chars, upper/lower case, digit and special char
   */
  static validateStrongPassword(password) {
    const value = String(password || '');
    if (value.length < 8) {
      return false;
    }

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    return hasUpper && hasLower && hasDigit && hasSpecial;
  }

  /**
   * Defines secure cookie settings for storing auth token in browser
   */
  static buildAuthCookieOptions() {
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    };
  }

  /**
   * Creates a signed JWT token with user identity and role
   */
  static signToken(payload) {
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
    return jwt.sign(payload, secret, { expiresIn: '1d' });
  }

  /**
   * Registers a new user:
   * - validates input
   * - checks existence
   * - hashes password
   * - stores it
   * - returns auth token
   */
  static async register({ id_number, password }) {
    if (!this.validateIdNumber(id_number)) {
      throw this.makeError('Invalid id_number. It must be a valid 9-digit ID.', 400);
    }

    if (!this.validateStrongPassword(password)) {
      throw this.makeError('Weak password. Use at least 8 chars with upper, lower, number and special char.', 400);
    }

    const role = await AuthDL.resolveUserRole(id_number);
    if (!role) {
      throw this.makeError('User id_number was not found in Students or Teachers tables.', 404);
    }

    const existing = await AuthDL.findPasswordByIdNumber(id_number);
    if (existing) {
      throw this.makeError('User already registered.', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await AuthDL.insertPassword(id_number, passwordHash);

    const user = await AuthDL.getUserDetailsByRoleAndIdNumber(role, id_number);
    if (!user) {
      throw this.makeError('User details were not found after registration.', 500);
    }

    const token = this.signToken({ id_number, role });
    return { token, role, id_number, user };
  }

  /**
   * Logs in a user:
   * - validates input
   * - checks stored credentials
   * - compares password hash
   * - returns auth token
   */
  static async login({ id_number, password }) {
    if (!this.validateIdNumber(id_number)) {
      throw this.makeError('Invalid id_number. It must be a valid 9-digit ID.', 400);
    }

    if (!password) {
      throw this.makeError('Password is required.', 400);
    }

    const existing = await AuthDL.findPasswordByIdNumber(id_number);
    if (!existing) {
      throw this.makeError('User is not registered.', 404);
    }

    const role = await AuthDL.resolveUserRole(id_number);
    if (!role) {
      throw this.makeError('Could not resolve a valid user role.', 409);
    }

    const passwordOk = await bcrypt.compare(String(password || ''), existing.password_hash);
    if (!passwordOk) {
      throw this.makeError('Invalid credentials.', 401);
    }

    const user = await AuthDL.getUserDetailsByRoleAndIdNumber(role, id_number);
    if (!user) {
      throw this.makeError('User details were not found.', 500);
    }

    const token = this.signToken({ id_number, role });
    return { token, role, id_number, user };
  }
}

module.exports = AuthBL;