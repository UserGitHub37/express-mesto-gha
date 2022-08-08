const { STATUS_CODE_NOT_FOUND } = require('../utils/statusCodes');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_NOT_FOUND;
  }
}

module.exports = NotFoundError;
