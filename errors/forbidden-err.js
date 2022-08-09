const { STATUS_CODE_FORBIDDEN } = require('../utils/statusCodes');

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_FORBIDDEN;
  }
}

module.exports = Forbidden;
