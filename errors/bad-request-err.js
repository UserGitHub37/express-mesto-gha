const { STATUS_CODE_BAD_REQUEST } = require('../utils/statusCodes');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_BAD_REQUEST;
  }
}

module.exports = BadRequest;
