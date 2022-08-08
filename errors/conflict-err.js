const { STATUS_CODE_CONFLICT } = require('../utils/statusCodes');

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_CONFLICT;
  }
}

module.exports = Conflict;
