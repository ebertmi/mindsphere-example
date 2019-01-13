const JWT = require("jsonwebtoken");

const DEFAULT_EXP_DISTANCE = 5 * 1000* 60; // 5 min

class TokenCache {
  constructor(expDistance=DEFAULT_EXP_DISTANCE) {
    this._expDistance = expDistance
    this._token = null;
    this._exp = null; // Milliseconds
  }

  isExpired() {
    if (this._token == null || this._exp == null) {
      return false;
    }

    // Check if token expired including expiration distance, e.g. 5 min
    return (this._exp + this._expDistance) <= new Date().getTime();
  }

  get() {
    if (this.isExpired()) {
      return null;
    }

    return this._token;
  }
/**
 * Updates the cache with the provided token.
 *
 * @param {string} jwt - raw token
 * @returns {void}
 * @throws {JsonWebTokenError} if provided token is malformed or invalid
 * @memberof TokenCache
 */
set(jwt) {
    if (jwt == null) {
      this._token = null;
      this._exp = null;
      return;
    }

    // Decode
    const decoded = JWT.decode(jwt);
    if (decoded == null) {
      throw new Error('Invalid JWT token');
    }

    this._token = jwt;
    this._exp = decoded.exp;
  }
}

module.exports = TokenCache;