const { STATUS_CODE_UNAUTHORIZED } = require('../utils/statusCodes');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
